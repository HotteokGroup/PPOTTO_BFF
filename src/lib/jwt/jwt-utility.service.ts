import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import type { AuthJwtPayload } from './auth-jwt/auth-jwt.interface';
import type { TemporaryJwtPayload } from './temporary-jwt/temporary-jwt.interface';

@Injectable()
export class JwtUtilityService {
  private readonly AUTH_JWT_SECRET: string;

  private readonly AUTH_JWT_EXPIRE: string;

  private readonly TEMPORARY_JWT_SECRET: string;

  private readonly TEMPORARY_JWT_EXPIRE: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {
    this.AUTH_JWT_SECRET = this.configService.getOrThrow<string>('AUTH_JWT_SECRET');
    this.AUTH_JWT_EXPIRE = this.configService.getOrThrow<string>('AUTH_JWT_EXPIRE');
    this.TEMPORARY_JWT_SECRET = this.configService.getOrThrow<string>('TEMPORARY_JWT_SECRET');
    this.TEMPORARY_JWT_EXPIRE = this.configService.getOrThrow<string>('TEMPORARY_JWT_EXPIRE');
  }

  async generateAuthToken(payload: AuthJwtPayload) {
    return this.jwtService.signAsync(payload, {
      secret: this.AUTH_JWT_SECRET,
      expiresIn: this.AUTH_JWT_EXPIRE,
    });
  }

  async validationAuthToken(token: string): Promise<AuthJwtPayload> {
    return this.jwtService.verifyAsync<AuthJwtPayload>(token, {
      secret: this.AUTH_JWT_SECRET,
    });
  }

  async generateTemporaryToken(payload: TemporaryJwtPayload) {
    return this.jwtService.signAsync(payload, {
      secret: this.TEMPORARY_JWT_SECRET,
      expiresIn: this.TEMPORARY_JWT_EXPIRE,
    });
  }

  async validationTemporaryToken(token: string): Promise<TemporaryJwtPayload> {
    return this.jwtService.verifyAsync<TemporaryJwtPayload>(token, {
      secret: this.TEMPORARY_JWT_SECRET,
    });
  }
}
