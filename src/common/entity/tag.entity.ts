import { ApiProperty } from '@nestjs/swagger';
import { Tag } from '@prisma/client';
import { Expose, Type } from 'class-transformer';
import { BlogTagEntity } from './blog-tag.entity';

@Expose()
export class TagEntity implements Tag {
  @ApiProperty({ type: String, description: 'Tag unique identifier' })
  id: string;

  @ApiProperty({ type: String, description: 'Tag name' })
  name: string;

  @ApiProperty({ type: String, description: 'Unique slug for the tag' })
  slug: string;

  @ApiProperty({ type: Date, description: 'Tag creation timestamp' })
  createdAt: Date;

  @ApiProperty({ type: Date, description: 'Tag last updated timestamp' })
  updatedAt: Date;

  @ApiProperty({
    type: () => [BlogTagEntity],
    description: 'Blogs associated with this tag',
  })
  @Type(() => BlogTagEntity)
  blogs: BlogTagEntity[];

  constructor(partial: Partial<TagEntity>) {
    Object.assign(this, partial);
  }
}
