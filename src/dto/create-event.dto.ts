import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ConsentType } from '@prisma/client';

export class ConsentDto {
  @ApiProperty({ description: 'Consent type', example: 'email_notifications' })
  @IsEnum(ConsentType) // Validate against the `ConsentType` enum
  id: ConsentType;

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
