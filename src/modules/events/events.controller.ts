import { Controller, Post, Body, Get, Query, Param } from '@nestjs/common';
import { ApiTags, ApiBody, ApiQuery, ApiParam } from '@nestjs/swagger';
import { EventsService } from './events.service';
import { CreateEventDto } from '../../dto/create-event.dto';
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

  /**
   * Retrieves the latest consent state for a given user ID.
   * @param {string} id - The user ID to fetch consent state for.
   * @returns The latest state of consents for the user.
   */
  @Get('consent/:userId')
  @ApiParam({ name: 'userId', description: 'ID of the user' })
  async getConsentStatus(@Param('userId') userId: string) {
    return this.eventsService.getUserConsentStatus(userId);
  }
}
