import { Profile } from '@prisma/client';
import { Expose } from 'class-transformer';
import 'reflect-metadata';

@Expose()
export class ProfileEntity implements Profile {
  id: string;
  userId: string;
  bio: string | null;
  avatar: string | null;
  website: string | null;
  location: string | null;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<ProfileEntity>) {
    Object.assign(this, partial);
  }
}
