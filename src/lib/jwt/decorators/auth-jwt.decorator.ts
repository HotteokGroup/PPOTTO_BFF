import { createParamDecorator, ExecutionContext, SetMetadata } from '@nestjs/common';

import { AuthJwtPayload } from '../jwt-utility.interface';

export const UserInfo = createParamDecorator((_: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest<Request & { user: AuthJwtPayload }>();
  const payload = request.user;
  return { user: payload?.id ?? null };
});

/**
 * 토큰을 제공할 수는 있지만 필수는 아닌 경우에 사용합니다.
 * 1. 토큰을 제공하는 경우 -> user 정보 전달
 * 2. 토큰을 제공하지 않는 경우 -> user 정보를 null로 전달
 */
export const IS_AUTH_OPTIONAL = Symbol('IS_AUTH_OPTIONAL');
export const IsAuthOptional = () => SetMetadata(IS_AUTH_OPTIONAL, true);
