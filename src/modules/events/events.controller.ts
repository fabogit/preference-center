import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiBody } from '@nestjs/swagger';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-user.dto';

@ApiTags('Events')
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  @ApiBody({ type: CreateEventDto })
  async createEvent(@Body() createEventDto: CreateEventDto) {
    const { userId, consents } = createEventDto;
    return this.eventsService.createEvent(userId, consents);
  }
}
