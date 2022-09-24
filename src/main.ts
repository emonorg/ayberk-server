import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  MongoCastExceptionFilter,
  MongoExceptionFilter,
} from './exceptions/mongo.exception';
import { ResponseInterceptor } from './interceptors/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {});
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new MongoExceptionFilter());
  app.useGlobalFilters(new MongoCastExceptionFilter());
  await app.listen(3000);
}
bootstrap();
