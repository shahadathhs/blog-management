import { User as PrismaUser } from '@prisma/client';
import { Exclude, Expose } from 'class-transformer';
import 'reflect-metadata';

export enum User {
  User = 'USER',
  Admin = 'ADMIN',
  Moderator = 'MODERATOR',
}

@Expose()
export class UserEntity implements PrismaUser {
  id: string;
  name: string | null;
  email: string;
  roles: 'USER' | 'ADMIN' | 'MODERATOR';
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
