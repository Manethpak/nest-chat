import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors({
    allowedHeaders: '*',
    methods: '*',
    origin: '*',
    credentials: true,
  });

  await app.listen(3000, '0.0.0.0', () => {
    Logger.log('Listening at 0.0.0.0:3000', 'Bootstrap');
    Logger.log('Press Ctrl+C to quit', 'Bootstrap')
  });
}
bootstrap();
