import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';

import type { Request } from 'express';
import type { TemporaryJwtPayload } from 'src/lib/auth/temporary-jwt/temporary-jwt.interface';

import { TemporaryJwtService } from './temporary-jwt.service';

@Injectable()
export class TemporaryJwtGuard implements CanActivate {
  constructor(private temporaryJwtService: TemporaryJwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request & { temporaryUser: TemporaryJwtPayload }>();
    const token = this.extractTokenFromHeader(request);
    if (!token) throw new UnauthorizedException();

    try {
      const payload = await this.temporaryJwtService.validationToken(token);
      request.temporaryUser = payload;
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
