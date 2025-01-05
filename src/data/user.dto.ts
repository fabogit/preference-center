import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateUserDto {
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
  @IsUUID() // If userId is expected to be a UUID
  userId: string;
}
