import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Param,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from '../../dto/create-user.dto';
import { ApiTags, ApiBody, ApiQuery } from '@nestjs/swagger';
import { PaginationDto } from 'src/dto/pagination.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Creates a new user with the provided email.
   * @param {CreateUserDto} createUserDto - DTO containing the user email.
   * @returns The created user object.
   */
  @Post()
  @ApiBody({ type: CreateUserDto })
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto.email);
  }

  /**
   * Retrieves a paginated list of users.
   * @param {PaginationDto} paginationDto - DTO containing the pagination parameters (page and limit).
   * @returns A paginated list of users with total count and pagination information.
   */
  @Get()
  @ApiQuery({ name: 'page', required: false, type: Number, default: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, default: 10 })
  async getAllUsers(@Query() paginationDto: PaginationDto) {
    return this.usersService.getAllUsers(paginationDto);
  }

  /**
   * Deletes a user by their ID.
   * @param {string} id - The ID of the user to delete.
   * @returns The deleted user object.
   */
  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    return this.usersService.deleteUser(id);
  }
}
