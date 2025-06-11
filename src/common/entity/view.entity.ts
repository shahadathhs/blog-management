import { ApiProperty } from '@nestjs/swagger';
import { View } from '@prisma/client';
import { Expose, Type } from 'class-transformer';
import { BlogEntity } from './blog.entity';
import { UserEntity } from './user.entity';

@Expose()
export class ViewEntity implements View {
  @ApiProperty({ type: String, description: 'View unique identifier' })
  id: string;

  @ApiProperty({
    type: String,
    nullable: true,
    description: 'User ID if logged in',
  })
  userId: string | null;

  @ApiProperty({
    type: () => UserEntity,
    nullable: true,
    description: 'User who viewed',
  })
  @Type(() => UserEntity)
  user?: UserEntity | null;

  @ApiProperty({ type: String, description: 'Related blog ID' })
  blogId: string;

  @ApiProperty({ type: () => BlogEntity, description: 'Related blog' })
  @Type(() => BlogEntity)
  blog: BlogEntity;

  @ApiProperty({
    type: String,
    nullable: true,
    description: 'IP address of viewer (anonymous)',
  })
  ipAddress: string | null;

  @ApiProperty({
    type: String,
    nullable: true,
    description: 'User agent info (browser/device)',
  })
  userAgent: string | null;

  @ApiProperty({ type: Date, description: 'Timestamp of view' })
  viewedAt: Date;

  constructor(partial: Partial<ViewEntity>) {
    Object.assign(this, partial);
  }
}
