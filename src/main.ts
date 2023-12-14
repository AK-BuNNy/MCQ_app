import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(express.json());
  app.setGlobalPrefix('api');
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(8000);
}
bootstrap();
