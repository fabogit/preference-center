import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional, IsInt, Min, Max } from 'class-validator';

export class PaginationDto {
  @ApiProperty({
    required: false,
    example: 1,
    description: 'Page number (default is 1)',
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Transform(({ value }) => parseInt(value, 10)) // Convert the value to an integer
  page?: number = 1;

  @ApiProperty({
    required: false,
    example: 10,
    description: 'Number of items per page (default is 25, max is 100)',
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  @Transform(({ value }) => parseInt(value, 10)) // Convert the value to an integer
  limit?: number = 25;
}
