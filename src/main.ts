import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AuthorizationGuard } from './auth/guards/authorization.guard';
import {
  MongoCastExceptionFilter,
  MongoExceptionFilter,
} from './lib/exceptions/mongo.exception';
import { ResponseInterceptor } from './lib/interceptors/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {});
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new MongoExceptionFilter());
  app.useGlobalFilters(new MongoCastExceptionFilter());
  await app.listen(3000);
}
bootstrap();
