import { ApiProperty } from '@nestjs/swagger';
import { Blog } from '@prisma/client';
import { Expose, Type } from 'class-transformer';
import { BlogTagEntity } from './blog-tag.entity';
import { CommentEntity } from './comment.entity';
import { NotificationEntity } from './notification.entity';
import { ViewEntity } from './view.entity';

@Expose()
export class BlogEntity implements Blog {
  @ApiProperty({ type: String, description: 'Blog unique identifier' })
  id: string;

  @ApiProperty({ type: String, description: 'Blog title' })
  title: string;

  @ApiProperty({
    type: String,
    description: 'Full blog content (Markdown/HTML)',
  })
  content: string;

  @ApiProperty({ type: String, description: 'URL-friendly slug for the blog' })
  slug: string;

  @ApiProperty({
    type: Boolean,
    description: 'Indicates if the blog is published',
  })
  published: boolean;

  @ApiProperty({
    type: String,
    description: 'ID of the author who created the blog',
  })
  authorId: string;

  @ApiProperty({ type: Date, description: 'Blog creation timestamp' })
  createdAt: Date;

  @ApiProperty({ type: Date, description: 'Blog last update timestamp' })
  updatedAt: Date;

  @ApiProperty({
    type: () => [CommentEntity],
    description: 'Comments associated with the blog',
    required: false,
  })
  @Type(() => CommentEntity)
  comments?: CommentEntity[];

  @ApiProperty({
    type: () => [ViewEntity],
    description: 'Views on this blog',
    required: false,
  })
  @Type(() => ViewEntity)
  views?: ViewEntity[];

  @ApiProperty({
    type: () => [NotificationEntity],
    description: 'Notifications related to this blog',
    required: false,
  })
  @Type(() => NotificationEntity)
  notifications?: NotificationEntity[];

  @ApiProperty({
    type: () => [BlogTagEntity],
    description: 'Tags associated with this blog',
    required: false,
  })
  @Type(() => BlogTagEntity)
  tags?: BlogTagEntity[];

  constructor(partial: Partial<BlogEntity>) {
    Object.assign(this, partial);
  }
}
