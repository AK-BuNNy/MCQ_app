import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
 const app = await NestFactory.create<NestExpressApplication>(AppModule, {
   bodyParser: false,
 });
  app.setGlobalPrefix('api');
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe(),
  );
  await app.listen(8000);
}
bootstrap();
