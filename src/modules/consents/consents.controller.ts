import { Controller, Get, Param } from '@nestjs/common';
import { ConsentsService } from './consents.service';

@Controller('consents')
export class ConsentsController {
  constructor(private readonly consentsService: ConsentsService) {}

  @Get(':userId')
  async getUserConsents(@Param('userId') userId: string) {
    const userConsents =
      await this.consentsService.getLatestConsentsForUser(userId);

    if (!userConsents) {
      return 'User not found';
    }

    return userConsents;
  }
}
