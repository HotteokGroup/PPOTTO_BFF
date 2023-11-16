import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });
  const configService = app.get<ConfigService>(ConfigService);

  const servicePort = configService.getOrThrow<number>('SERVICE_PORT');
  const environment = configService.getOrThrow<string>('ENVIRONMENT');

  if (environment !== 'prod') {
    const config = new DocumentBuilder()
      .setTitle('PPOTTO BFF API')
      .setDescription('뽀또 BFF 서비스')
      .setVersion('1.0')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'jwt',
          description: '일반 JWT',
          in: 'header',
        },
        'jwt',
      )
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'jwt',
          description: '회원가입 용 임시 JWT',
          in: 'header',
        },
        'temporary-jwt',
      )
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document, { customSiteTitle: 'BFF API' });
  }

  await app.listen(servicePort);
}
bootstrap();
