import { ApiProperty } from '@nestjs/swagger';
import { User as PrismaUser, Profile } from '@prisma/client';
import { Exclude, Expose, Type } from 'class-transformer';
import { UserEnum } from 'src/common/enum/user.enum';
import { ProfileEntity } from './profile.entity';

@Expose()
export class UserEntity implements PrismaUser {
  @ApiProperty({ type: String, description: 'User unique identifier' })
  id: string;

  @ApiProperty({ type: String, nullable: true, description: 'User full name' })
  name: string | null;

  @ApiProperty({ type: String, description: 'User email address' })
  email: string;

  @ApiProperty({ enum: UserEnum, description: 'User role' })
  roles: UserEnum;

  @ApiProperty({
    type: Boolean,
    description: 'Whether the user has verified their email',
  })
  emailVerified: boolean;

  @ApiProperty({ type: String, description: 'Email verification token' })
  verificationToken: string;

  @ApiProperty({
    type: String,
    nullable: true,
    description: 'Google ID if registered with Google',
  })
  googleId: string | null;

  @ApiProperty({
    type: String,
    nullable: true,
    description: 'Password reset token',
  })
  resetToken: string | null;

  @ApiProperty({
    type: Date,
    nullable: true,
    description: 'Password reset token expiration date',
  })
  resetTokenExpiry: Date | null;

  @ApiProperty({ type: Boolean, description: 'Account active status' })
  isActive: boolean;

  @ApiProperty({ type: Date, description: 'User creation timestamp' })
  createdAt: Date;

  @ApiProperty({ type: Date, description: 'User last updated timestamp' })
  updatedAt: Date;

  @Exclude()
  password: string | null;

  @ApiProperty({
    type: () => ProfileEntity,
    nullable: true,
    description: 'Linked profile details',
  })
  @Type(() => ProfileEntity)
  profile?: Profile | null;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
