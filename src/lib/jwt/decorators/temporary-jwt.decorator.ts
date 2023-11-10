import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { TemporaryJwtPayload } from '../jwt-utility.interface';

export const TemporaryUserAuth = createParamDecorator((_: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest<Request & { user: TemporaryJwtPayload }>();
  const payload = request.user;
  return { ...(payload ?? null) };
});
