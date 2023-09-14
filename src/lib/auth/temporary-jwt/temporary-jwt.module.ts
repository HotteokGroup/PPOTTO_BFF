import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { TemporaryJwtService } from './temporary-jwt.service';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>('TEMPORARY_JWT_SECRET'),
        signOptions: { expiresIn: configService.getOrThrow<string>('TEMPORARY_JWT_EXPIRE') },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [TemporaryJwtService],
  exports: [TemporaryJwtService],
})
export class TemporaryJwtModule {}
