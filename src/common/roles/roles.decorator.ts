import { SetMetadata } from '@nestjs/common';
import { UserEnum } from '../enum/user.enum';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: UserEnum[]) => SetMetadata(ROLES_KEY, roles);
