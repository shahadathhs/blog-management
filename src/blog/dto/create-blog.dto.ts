import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateBlogDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsNotEmpty()
  slug: string;

  @IsOptional()
  @IsBoolean()
  published?: boolean;

  @IsArray()
  @IsString({ each: true })
  tagIds: string[];
}
