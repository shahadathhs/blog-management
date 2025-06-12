import { Request } from 'express';
import { UserEnum } from '../enum/user.enum';

export interface RequestWithUser extends Request {
  user?: {
    roles?: UserEnum[];
    email?: string;
    userId?: string;
    [key: string]: unknown;
  };
}

export interface UserTokenPayload {
  roles: UserEnum[];
  email: string;
  userId: string;
}
