import { Controller, Get } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Controller('test')
export class TestController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('users')
  async getAllUsers() {
    return this.prisma.user.findMany(); // This will throw an error if the database schema is not set
  }
}
