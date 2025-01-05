import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ConsentDto } from './consent.dto';

export class CreateEventDto {
  @ApiProperty({ description: 'User ID', example: 'uuid-of-the-user' })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    description: 'List of consents',
    type: [ConsentDto],
    example: [
      { id: 'email_notifications', enabled: true },
      { id: 'sms_notifications', enabled: false },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ConsentDto)
  consents: ConsentDto[];
}

export class EventDto {
  id: string;
  userId: string;
  createdAt: string;
}
