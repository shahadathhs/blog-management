import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class FindAllBlogsQueryDto {
  @ApiPropertyOptional({ example: 1, description: 'Page number (default: 1)' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    example: 10,
    description: 'Items per page (default: 10)',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number = 10;

  @ApiPropertyOptional({
    example: 'nestjs',
    description: 'Search by blog title or content',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    example: 'typescript',
    description: 'Filter by tag name or slug',
  })
  @IsOptional()
  @IsString()
  tag?: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Filter by blog publish status',
  })
  @IsOptional()
  @IsBoolean()
  published?: boolean;

  @ApiPropertyOptional({
    example: '533677a1-89e1-4baa-b46f-ab07e2012290',
    description: 'Filter by author Id',
  })
  @IsOptional()
  @IsString()
  authorId?: string;
}
