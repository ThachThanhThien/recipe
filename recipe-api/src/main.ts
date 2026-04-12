import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { LanguageInterceptor } from './common/interceptors/language.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Swagger config
  const config = new DocumentBuilder()
    .setTitle('Cooking Recipes API')
    .setDescription('API documentation for Recipe & Ingredients management')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useGlobalInterceptors(new LanguageInterceptor());

  app.enableCors({
    origin: ['http://localhost:4200'], // Cho phép Angular dev app gọi API
  });
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
