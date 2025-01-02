import { Controller, Post, Body } from '@nestjs/common';
import { EventsService } from './events.service';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  async createEvent(
    @Body('userId') userId: string,
    @Body('consents') consents: any,
  ) {
    return this.eventsService.createEvent(userId, consents);
  }
}
