import { Request } from 'express';
import { UserEnum } from '../enum/user.enum';

export interface RequestWithUser extends Request {
  user?: {
    roles?: UserEnum[];
    [key: string]: unknown;
  };
}
