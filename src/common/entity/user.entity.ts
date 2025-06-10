import { ApiProperty } from '@nestjs/swagger';
import { User as PrismaUser, Profile } from '@prisma/client';
import { Exclude, Expose, Type } from 'class-transformer';
import { UserEnum } from 'src/common/enum/user.enum';
import { ProfileEntity } from './profile.entity';

@Expose()
export class UserEntity implements PrismaUser {
  @ApiProperty({ type: String, description: 'User unique identifier' })
  id: string;

  @ApiProperty({ type: String, description: 'User email address' })
  email: string;

  @ApiProperty({ enum: UserEnum, description: 'User role' })
  roles: UserEnum;

  @ApiProperty({
    type: Boolean,
    description: 'Whether the user has verified their email',
  })
  emailVerified: boolean;

  @ApiProperty({
    type: String,
    nullable: true,
    description: 'Google ID if registered with Google',
  })
  googleId: string | null;

  @Exclude()
  verificationToken: string;

  @Exclude()
  resetToken: string | null;

  @Exclude()
  resetTokenExpiry: Date | null;

  @Exclude()
  emailLoginCode: string | null;

  @Exclude()
  emailLoginCodeExpiry: Date | null;

  @Exclude()
  password: string | null;

  @ApiProperty({ type: Boolean, description: 'Account active status' })
  isActive: boolean;

  @ApiProperty({ type: Date, description: 'User creation timestamp' })
  createdAt: Date;

  @ApiProperty({ type: Date, description: 'User last updated timestamp' })
  updatedAt: Date;

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
