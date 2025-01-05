import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { ApiTags, ApiBody, ApiQuery } from '@nestjs/swagger';
import { EventsService } from './events.service';
import { CreateEventDto } from '../../dto/event.dto';
import { PaginationDto } from 'src/dto/pagination.dto';

@ApiTags('Events')
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  /**
   * Retrieves a paginated list of events.
   * @param {PaginationDto} paginationDto - DTO containing the pagination parameters.
   * @returns A paginated list of events with total count and pagination information.
   */
  @Get()
  @ApiQuery({ name: 'page', required: false, type: Number, default: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, default: 10 })
  async getAllEvents(@Query() paginationDto: PaginationDto) {
    return this.eventsService.getAllEvents(paginationDto);
  }

  /**
   * Creates a new event for a user with consents.
   * @param {CreateEventDto} createEventDto - DTO containing user ID and consents data.
   * @returns The created event object.
   */
  @Post()
  @ApiBody({ type: CreateEventDto })
  async createEvent(@Body() createEventDto: CreateEventDto) {
    const { userId, consents } = createEventDto;
    return this.eventsService.createEvent(userId, consents);
  }
}
