import { Module } from '@nestjs/common';

import { AuthJwtModule } from './auth-jwt/auth-jwt.module';
import { TemporaryJwtModule } from './temporary-jwt/temporary-jwt.module';

@Module({
  imports: [TemporaryJwtModule, AuthJwtModule],
})
export class AuthModule {}
