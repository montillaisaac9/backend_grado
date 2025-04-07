import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exeption.filters';
import { DatabaseExceptionFilter } from './common/filters/database-exception.filter';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { Logger } from '@nestjs/common'

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('API del Sistema de Comedor')
    .setDescription('Documentación de la API del comedor universitario')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
  app.useGlobalPipes(new ValidationPipe());
  app.useLogger(new Logger())
  app.useGlobalFilters(
    new HttpExceptionFilter(),
    new DatabaseExceptionFilter(),
    new GlobalExceptionFilter(),
  );
  app.use(cookieParser());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
