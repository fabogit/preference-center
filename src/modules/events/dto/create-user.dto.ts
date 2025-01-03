import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class ConsentDto {
  @ApiProperty({ description: 'Consent ID', example: 'email_notifications' })
  @IsString()
  id: string;

  @ApiProperty({ description: 'Whether consent is enabled', example: true })
  @IsBoolean()
  enabled: boolean;
}

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
