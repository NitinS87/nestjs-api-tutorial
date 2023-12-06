import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // remove all the properties that are not part of the DTO
      forbidNonWhitelisted: true, // throw an error if the request contains properties that are not part of the DTO
      transform: true, // transform the data to the type specified in the DTO
    }),
  );
  await app.listen(8000);
}
bootstrap();
