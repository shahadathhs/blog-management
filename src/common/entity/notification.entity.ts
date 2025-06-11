import { ApiProperty } from '@nestjs/swagger';
import { Notification, NotificationType } from '@prisma/client';
import { Expose, Type } from 'class-transformer';
import { BlogEntity } from './blog.entity';
import { UserEntity } from './user.entity';

@Expose()
export class NotificationEntity implements Notification {
  @ApiProperty({ type: String, description: 'Notification unique identifier' })
  id: string;

  @ApiProperty({ enum: NotificationType, description: 'Type of notification' })
  type: NotificationType;

  @ApiProperty({ type: String, description: 'Notification message' })
  message: string;

  @ApiProperty({ type: Boolean, description: 'Read status' })
  read: boolean;

  @ApiProperty({ type: String, description: 'Recipient user ID' })
  recipientId: string;

  @ApiProperty({
    type: () => UserEntity,
    description: 'Notification recipient',
  })
  @Type(() => UserEntity)
  recipient: UserEntity;

  @ApiProperty({
    type: String,
    nullable: true,
    description: 'Actor user ID who triggered notification',
  })
  actorId: string | null;

  @ApiProperty({
    type: () => UserEntity,
    nullable: true,
    description: 'Notification actor',
  })
  @Type(() => UserEntity)
  actor?: UserEntity | null;

  @ApiProperty({ type: String, nullable: true, description: 'Related blog ID' })
  blogId: string | null;

  @ApiProperty({
    type: () => BlogEntity,
    nullable: true,
    description: 'Related blog',
  })
  @Type(() => BlogEntity)
  blog?: BlogEntity | null;

  @ApiProperty({
    type: String,
    nullable: true,
    description: 'Related comment ID',
  })
  commentId: string | null;

  @ApiProperty({
    type: Object,
    nullable: true,
    description: 'Additional metadata in JSON format',
  })
  metadata: object | null;

  @ApiProperty({ type: Date, description: 'Notification creation timestamp' })
  createdAt: Date;

  @ApiProperty({
    type: Date,
    nullable: true,
    description: 'Timestamp when notification was read',
  })
  readAt: Date | null;

  constructor(partial: Partial<NotificationEntity>) {
    Object.assign(this, partial);
  }
}
