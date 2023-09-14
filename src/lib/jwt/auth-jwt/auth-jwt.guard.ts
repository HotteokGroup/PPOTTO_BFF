import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import type { Request } from 'express';

import { IS_AUTH_OPTIONAL } from './auth-jwt.decorator';
import { AuthJwtPayload } from './auth-jwt.interface';
import { JwtUtilityService } from '../jwt-utility.service';

@Injectable()
export class AuthJwtGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtUtilityService: JwtUtilityService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request & { user: AuthJwtPayload }>();
    const token = this.extractTokenFromHeader(request);

    // isAuthOptional인 경우 토큰이 없어도 인증 생략
    const isAuthOptional = this.isAuthOptional(context);
    if (isAuthOptional && !token) {
      return true;
    }

    if (!token) throw new UnauthorizedException();

    try {
      const payload = await this.jwtUtilityService.validationAuthToken(token);
      request.user = payload;
    } catch (error) {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  private isAuthOptional(context: ExecutionContext): boolean {
    // metadata로 IS_AUTH_OPTIONAL 값 추출
    return this.reflector.get<boolean>(IS_AUTH_OPTIONAL, context.getHandler());
  }
}
