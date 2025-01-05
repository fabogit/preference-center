import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsEmail, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class userEmailDto {
  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
    type: String,
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

/**
 * DTO to validate userId in the URL parameter.
 */
export class UserIdDto {
  @IsString()
  @IsUUID()
  id: string;
}

export class ResCDUserDto {
  @IsUUID()
  id: string;

  @IsEmail()
  email: string;

  @IsDate()
  @Type(() => Date)
  createdAt: Date;

  @IsDate()
  @Type(() => Date)
  updatedAt: Date;
}
