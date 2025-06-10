import { ApiProperty } from '@nestjs/swagger';
import { BlogTag } from '@prisma/client';
import { Expose, Type } from 'class-transformer';
import { BlogEntity } from './blog.entity';
import { TagEntity } from './tag.entity';

@Expose()
export class BlogTagEntity implements BlogTag {
  @ApiProperty({ type: String, description: 'BlogTag unique identifier' })
  id: string;

  @ApiProperty({ type: String, description: 'Blog ID' })
  blogId: string;

  @ApiProperty({ type: String, description: 'Tag ID' })
  tagId: string;

  @ApiProperty({ type: Date, description: 'Creation timestamp' })
  createdAt: Date;

  @ApiProperty({ type: () => BlogEntity, description: 'Related blog' })
  @Type(() => BlogEntity)
  blog: BlogEntity;

  @ApiProperty({ type: () => TagEntity, description: 'Related tag' })
  @Type(() => TagEntity)
  tag: TagEntity;

  constructor(partial: Partial<BlogTagEntity>) {
    Object.assign(this, partial);
  }
}
