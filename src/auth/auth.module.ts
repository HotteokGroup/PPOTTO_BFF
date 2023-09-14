import { Module } from '@nestjs/common';

import { JwtUtilityModule } from '../lib/jwt/jwt-utility.module';

@Module({
  imports: [JwtUtilityModule],
})
export class AuthModule {}
