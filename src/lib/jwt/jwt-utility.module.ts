import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { JwtUtilityService } from './jwt-utility.service';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        return {
          secret: configService.get<string>('AUTH_JWT_SECRET'),
          signOptions: {
            expiresIn: configService.get<string>('AUTH_JWT_EXPIRE'),
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [JwtUtilityService],
  exports: [JwtUtilityService],
})
export class JwtUtilityModule {}
