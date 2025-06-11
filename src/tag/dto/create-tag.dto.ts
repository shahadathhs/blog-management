import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTagDto {
  @ApiProperty({
    example: 'JavaScript',
    description: 'Name of the tag',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'javascript',
    description:
      'Slug for the tag (usually lowercase and URL-friendly). It will auto generated if not provided',
  })
  @IsString()
  @IsOptional()
  slug?: string;
}
