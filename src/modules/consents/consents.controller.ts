import { Controller, Get, Param } from '@nestjs/common';
import { ConsentsService } from './consents.service';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { ParseUUIDPipe } from '@nestjs/common';
import { ConsentDto } from 'src/data/consent.dto';
import { UserIdDto } from 'src/data/user.dto';

/**
 * Controller to handle user consent endpoints
 */
@ApiTags('consents') // Group the endpoints under "consents" in Swagger UI
@Controller('consents')
export class ConsentsController {
  constructor(private readonly consentsService: ConsentsService) {}

  /**
   * Fetch the latest consent values for a given user.
   *
   * @param userId The ID of the user whose consents are to be fetched.
   * @returns The most recent consent values for the user or a not found message.
   */
  @Get(':userId')
  @ApiOperation({ summary: 'Get the latest consents for a user' }) // Operation description
  @ApiParam({
    name: 'userId',
    description: 'The ID of the user whose consents are to be fetched',
    type: UserIdDto,
  })
  @ApiResponse({
    status: 200,
    description: 'The latest consent values for the user',
    type: [ConsentDto],
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  async getUserConsents(@Param('userId', ParseUUIDPipe) userId: string) {
    const userConsents =
      await this.consentsService.getLatestConsentsForUser(userId);

    if (!userConsents) {
      return 'User not found';
    }
    return userConsents;
  }
}
