import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class EventsService {
  constructor(private readonly prisma: PrismaService) {}

  async createEvent(userId: string, consents: any) {
    return this.prisma.event.create({
      data: {
        userId,
        consents,
      },
    });
  }
}
