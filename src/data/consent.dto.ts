import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum } from 'class-validator';
import { ConsentType } from '@prisma/client';

export class ConsentDto {
  @ApiProperty({ description: 'Consent type', example: 'email_notifications' })
  @IsEnum(ConsentType) // Validate against the `ConsentType` enum
  id: ConsentType;

  @ApiProperty({ description: 'Whether consent is enabled', example: true })
  @IsBoolean()
  enabled: boolean;
}
