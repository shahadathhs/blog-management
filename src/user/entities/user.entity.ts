import { User as PrismaUser } from '@prisma/client';
import { Exclude, Expose } from 'class-transformer';
import 'reflect-metadata';
import { UserEnum } from 'src/enum/user.enum';

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

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
