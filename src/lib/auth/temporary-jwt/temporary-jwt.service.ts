import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { TemporaryJwtPayload } from './temporary-jwt.interface';

@Injectable()
export class TemporaryJwtService {
  constructor(private readonly jwtService: JwtService) {}

  async generateToken(payload: TemporaryJwtPayload) {
    return this.jwtService.signAsync(payload);
  }

  async validationToken(token: string) {
    return this.jwtService.verifyAsync(token);
  }
}
