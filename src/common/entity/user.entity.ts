import { User as PrismaUser, Profile } from '@prisma/client';
import { Exclude, Expose, Type } from 'class-transformer';
import 'reflect-metadata';
import { UserEnum } from 'src/common/enum/user.enum';
import { ProfileEntity } from './profile.entity';

@Expose()
export class UserEntity implements PrismaUser {
  id: string;
  name: string | null;
  email: string;
  roles: UserEnum;
  emailVerified: boolean;
  verificationToken: string;
  googleId: string | null;
  resetToken: string | null;
  resetTokenExpiry: Date | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;

  @Exclude()
  password: string | null;

  //  profile relation
  @Type(() => ProfileEntity)
  profile?: Profile | null;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
