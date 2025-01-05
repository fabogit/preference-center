import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PaginationDto } from 'src/dto/pagination.dto';
import { ConsentDto } from 'src/dto/event.dto';
import { ConsentType } from '@prisma/client';

@Injectable()
export class EventsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Retrieves a paginated list of all events.
   * @param {PaginationDto} paginationDto - DTO containing the pagination parameters.
   * @returns An object containing total events, total pages, and the list of events.
   */
  async getAllEvents(paginationDto: PaginationDto) {
    try {
      const { page, limit } = paginationDto;
      // Calculate total events and pages

      const totalEvents = await this.prisma.event.count();
      const totalPages = Math.ceil(totalEvents / limit);

      const events = await this.prisma.event.findMany({
        skip: (page - 1) * limit, // Skip the events based on the current page
        take: limit, // Limit the number of events per page
      });

      return {
        totalEvents, // Total number of events in the database
        totalPages, // Total number of pages
        page, // Current page
        limit, // Number of events per page
        events, // Paginated list of events
      };
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to fetch events for page ${paginationDto.page} with limit ${paginationDto.limit}`,
        error.message,
      );
    }
  }

  /**
   * Creates a new event for a user with consents.
   * @param {string} userId - The user ID.
   * @param {ConsentDto[]} consents - Array of consents.
   * @returns The created event.
   */
  async createEvent(userId: string, consents: ConsentDto[]) {
    try {
      // Check if the user exists
      const userExists = await this.prisma.user.findUnique({
        where: { id: userId },
      });

      if (!userExists) {
        throw new NotFoundException(`User with ID ${userId} does not exist`);
      }

      // Map and validate consents
      const consentData = consents.map((consent) => {
        if (!Object.values(ConsentType).includes(consent.id as ConsentType)) {
          throw new BadRequestException(
            `Invalid consent type: ${consent.id}. Expected one of: ${Object.values(
              ConsentType,
            ).join(', ')}`,
          );
        }

        return {
          type: consent.id as ConsentType, // Ensure it matches the enum
          enabled: consent.enabled,
        };
      });

      // Create the event with nested consents
      return await this.prisma.event.create({
        data: {
          userId,
          consents: {
            create: consentData, // Use nested create syntax
          },
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to create event',
        error.message,
      );
    }
  }

  /**
   * Retrieves the latest consolidated consent state for a given user.
   * Each consent type reflects the most recent value across all events.
   * @param {string} userId - The user ID to fetch consent state for.
   * @returns {Record<string, boolean>} A map of consent types and their latest states.
   */
  async getUserConsentStatus(userId: string) {
    try {
      // Check if the user exists
      const userExists = await this.prisma.user.findUnique({
        where: { id: userId },
      });

      if (!userExists) {
        throw new NotFoundException(`User with ID ${userId} does not exist`);
      }

      // Fetch the latest events with their consents for the user
      const events = await this.prisma.event.findMany({
        where: { userId },
        include: { consents: true }, // Include related consents
        orderBy: { createdAt: 'desc' }, // Order by most recent first
      });

      if (!events || events.length === 0) {
        throw new NotFoundException(
          `No consent data found for user with ID ${userId}`,
        );
      }

      // Track the latest state of each consent type
      const consentState: Record<string, boolean> = {};

      for (const event of events) {
        for (const consent of event.consents) {
          // Update the state only if this consent type hasn't been recorded yet
          if (!(consent.type in consentState)) {
            consentState[consent.type] = consent.enabled;
          }
        }
      }

      // Return the consolidated consent state
      return consentState;
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to fetch user consent status',
        error.message,
      );
    }
  }
}
