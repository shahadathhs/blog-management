import { ApiProperty } from '@nestjs/swagger';
import { Comment } from '@prisma/client';
import { Expose, Type } from 'class-transformer';
import { BlogEntity } from './blog.entity';
import { UserEntity } from './user.entity';

@Expose()
export class CommentEntity implements Comment {
  @ApiProperty({ type: String, description: 'Comment unique identifier' })
  id: string;

  @ApiProperty({ type: String, description: 'Comment content' })
  content: string;

  @ApiProperty({ type: String, description: 'Related blog ID' })
  blogId: string;

  @ApiProperty({ type: () => BlogEntity, description: 'Related blog' })
  @Type(() => BlogEntity)
  blog: BlogEntity;

  @ApiProperty({ type: String, description: 'Author user ID' })
  authorId: string;

  @ApiProperty({ type: () => UserEntity, description: 'Author user' })
  @Type(() => UserEntity)
  author: UserEntity;

  @ApiProperty({
    type: String,
    nullable: true,
    description: 'Parent comment ID if this is a reply',
  })
  parentId: string | null;

  @ApiProperty({
    type: () => CommentEntity,
    nullable: true,
    description: 'Parent comment entity',
  })
  @Type(() => CommentEntity)
  parent?: CommentEntity | null;

  @ApiProperty({
    type: () => [CommentEntity],
    description: 'Replies to this comment',
  })
  @Type(() => CommentEntity)
  children: CommentEntity[];

  @ApiProperty({
    type: Boolean,
    description: 'Indicates if comment was edited',
  })
  isEdited: boolean;

  @ApiProperty({
    type: Date,
    nullable: true,
    description: 'Timestamp of last edit',
  })
  editedAt: Date | null;

  @ApiProperty({ type: Date, description: 'Comment creation timestamp' })
  createdAt: Date;

  @ApiProperty({ type: Date, description: 'Comment last updated timestamp' })
  updatedAt: Date;

  constructor(partial: Partial<CommentEntity>) {
    Object.assign(this, partial);
  }
}
