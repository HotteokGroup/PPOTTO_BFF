import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { AuthJwtPayload } from './auth-jwt.interface';

@Injectable()
export class AuthJwtService {
  constructor(private readonly jwtService: JwtService) {}

  async generateToken(payload: AuthJwtPayload) {
    return this.jwtService.signAsync(payload);
  }

  async validationToken(token: string) {
    return this.jwtService.verifyAsync(token);
  }
}
