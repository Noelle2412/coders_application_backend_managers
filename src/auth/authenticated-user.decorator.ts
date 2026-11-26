import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface User {
  id: string;
  role: string;
}

export const AuthenticatedUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): User => {
    return ctx.switchToHttp().getRequest().user;
  },
);
