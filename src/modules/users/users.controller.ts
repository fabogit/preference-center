import { Controller, Post, Body, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { userEmailDto, ResCDUserDto, UserIdDto } from '../../data/user.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async createUser(@Body() createUserDto: userEmailDto): Promise<ResCDUserDto> {
    return this.usersService.createUser(createUserDto.email);
  }

  @Delete()
  async deleteUser(@Body() userIdDto: UserIdDto): Promise<ResCDUserDto> {
    return this.usersService.deleteUser(userIdDto.id);
  }
}
