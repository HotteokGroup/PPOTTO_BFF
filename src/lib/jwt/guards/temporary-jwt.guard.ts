import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';

import type { Request } from 'express';

import { TemporaryJwtPayload } from '../jwt-utility.interface';
import { JwtUtilityService } from '../jwt-utility.service';

@Injectable()
export class TemporaryJwtGuard implements CanActivate {
  constructor(private readonly jwtUtilityService: JwtUtilityService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request & { user: TemporaryJwtPayload }>();
    const token = this.extractTokenFromHeader(request);
    if (!token) throw new UnauthorizedException();

    try {
      const payload = await this.jwtUtilityService.validationTemporaryToken(token);
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
}
