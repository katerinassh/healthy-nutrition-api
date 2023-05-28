import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { rateLimit } from 'express-rate-limit';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(
    rateLimit({
      windowMs: 10 * 60 * 1000, // 10 minutes
      max: 100, // Limit each IP to 100 requests per `window` (here, per 10 minutes)
      standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
      legacyHeaders: false,
      skipSuccessfulRequests: false, // The counting will skip all successful requests and just count the errors. Instead of removing rate-limiting, it's better to set this to true to limit the number of times a request fails
      message: { message: 'Too many requests', statusCode: 403 },
    }),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      transformOptions: {
        enableImplicitConversion: true, // allow conversion underneath
      },
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Healthy Nutrition API')
    .setDescription(
      'API to control protein, carbohydrates, fats and calories intake',
    )
    .addBearerAuth()
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
