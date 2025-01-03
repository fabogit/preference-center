import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EventsService {
  constructor(private readonly prisma: PrismaService) {}

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
