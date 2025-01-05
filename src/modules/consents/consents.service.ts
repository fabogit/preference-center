import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConsentType } from '@prisma/client';
import { ConsentDto } from 'src/data/consent.dto';

/**
 * Service to handle user consent logic, fetching the most recent consents for each consent type.
 */
@Injectable()
export class ConsentsService {
  private readonly logger = new Logger(ConsentsService.name, {
    timestamp: true,
  });

  constructor(private prisma: PrismaService) {}

  /**
   * Fetches the latest consent status for a given user.
   * This includes the `enabled` state of each consent type (email/sms notifications).
   *
   * @param userId The ID of the user whose consents are to be fetched.
   * @returns An array of the most recent consent values for each type.
   */
  async getLatestConsentsForUser(userId: string): Promise<ConsentDto[]> {
    try {
      // Fetch events and consents for the user from the database
      const userConsents = await this.prisma.user.findUnique({
        where: { id: userId },
        select: {
          events: {
            select: {
              consents: {
                select: {
                  type: true,
                  enabled: true,
                },
              },
            },
          },
        },
      });

      // If no events exist for the user, return an empty array
      if (!userConsents?.events?.length) {
        this.logger.warn(`No events found for user with ID: ${userId}`);
        return [];
      }

      // Create a container to hold the most recent consent for each type
      const latestConsents: Record<ConsentType, ConsentDto> =
        this.initializeLatestConsents();

      // Loop through all events and their consents to update the latest values
      userConsents.events.forEach((event) => {
        event.consents.forEach((consent) => {
          // Only update the consent if it doesn't exist yet or the value is different
          if (
            !latestConsents[consent.type] ||
            latestConsents[consent.type].enabled !== consent.enabled
          ) {
            latestConsents[consent.type] = {
              type: consent.type,
              enabled: consent.enabled,
            };
          }
        });
      });

      // Return the consentsarray
      return Object.values(latestConsents);
    } catch (error) {
      this.logger.error(
        `Error fetching consents for user with ID: ${userId}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Initializes the latest consents record with undefined values for each consent type.
   *
   * @returns A record with consent types as keys and `undefined` as values.
   */
  private initializeLatestConsents(): Record<
    ConsentType,
    ConsentDto | undefined
  > {
    const consentTypes = Object.values(ConsentType); // Get all values from the ConsentType enum
    return consentTypes.reduce(
      (acc, type) => {
        acc[type] = undefined; // Initialize with undefined for each consent type
        return acc;
      },
      {} as Record<ConsentType, ConsentDto | undefined>,
    );
  }
}
