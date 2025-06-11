import { ApiProperty } from '@nestjs/swagger';
import { Profile } from '@prisma/client';
import { Expose } from 'class-transformer';

@Expose()
export class ProfileEntity implements Profile {
  @ApiProperty({
    type: String,
    description: 'Unique identifier of the profile',
  })
  id: string;

  @ApiProperty({ type: String, description: 'ID of the associated user' })
  userId: string;

  @ApiProperty({ type: String, nullable: true, description: 'User full name' })
  name: string | null;

  @ApiProperty({ type: String, nullable: true, description: 'User biography' })
  bio: string | null;

  @ApiProperty({
    type: String,
    nullable: true,
    description: 'URL to the user avatar',
  })
  avatar: string | null;

  @ApiProperty({
    type: String,
    nullable: true,
    description: 'User personal website URL',
  })
  website: string | null;

  @ApiProperty({
    type: String,
    nullable: true,
    description: 'User location info',
  })
  location: string | null;

  @ApiProperty({ type: Date, description: 'Profile creation timestamp' })
  createdAt: Date;

  @ApiProperty({ type: Date, description: 'Profile last updated timestamp' })
  updatedAt: Date;

  constructor(partial: Partial<ProfileEntity>) {
    Object.assign(this, partial);
  }
}
