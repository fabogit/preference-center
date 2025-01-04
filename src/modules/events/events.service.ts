import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PaginationDto } from 'src/dto/pagination.dto';

@Injectable()
export class EventsService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllEvents(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;

    // Get the total count of events
    const totalEvents = await this.prisma.event.count();

    // Calculate total pages
    const totalPages = Math.ceil(totalEvents / limit);

    // Fetch the events based on pagination
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
  }

  async createEvent(
    userId: string,
    consents: { id: string; enabled: boolean }[],
  ) {
    const userExists = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!userExists) {
      throw new NotFoundException(`User with ID ${userId} does not exist`);
    }

    // Ensure consents are valid
    if (!Array.isArray(consents)) {
      throw new BadRequestException('Consents must be an array');
    }

    for (const consent of consents) {
      if (!consent.id || typeof consent.enabled !== 'boolean') {
        throw new BadRequestException(
          'Each consent must have a valid id and enabled property',
        );
      }
    }

    return this.prisma.event.create({
      data: {
        userId,
        consents,
      },
    });
  }
}
