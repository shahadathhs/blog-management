import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { RequestWithUser } from './jwt-user.interface';

export const GetUser = createParamDecorator(
  (key: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<RequestWithUser>();
    const user = request.user;

    return key ? user?.[key] : user;
  },
);
