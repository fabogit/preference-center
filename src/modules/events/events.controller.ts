import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { ApiTags, ApiBody, ApiQuery } from '@nestjs/swagger';
import { EventsService } from './events.service';
import { CreateEventDto } from '../../dto/create-event.dto';
import { PaginationDto } from 'src/dto/pagination.dto';

@ApiTags('Events')
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  @ApiQuery({ name: 'page', required: false, type: Number, default: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, default: 10 })
  async getAllEvents(@Query() paginationDto: PaginationDto) {
    return this.eventsService.getAllEvents(paginationDto);
  }

  @Post()
  @ApiBody({ type: CreateEventDto })
  async createEvent(@Body() createEventDto: CreateEventDto) {
    const { userId, consents } = createEventDto;
    return this.eventsService.createEvent(userId, consents);
  }
}
