import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import type { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import type { INestApplication } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors(getCorsOptions());
  setupSwagger(app);

  const port = Number(process.env.PORT ?? 3000);
  await app.listen(port);

  console.log(`Server is running on port ${port}`);
  console.log(`Swagger is running on http://localhost:${port}/api`);
}

function getCorsOptions(): CorsOptions {
  const allowedOrigins = [
    /^https?:\/\/localhost(?::\d+)?$/,
    /^https?:\/\/(?:[\w-]+\.)*mydomain\.com$/i,
  ];

  return {
    origin: allowedOrigins,
    methods: 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type,Authorization',
    credentials: true,
    exposedHeaders: ['Content-Disposition'],
    maxAge: 3600,
  };
}

function setupSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('BOM API')
    .setDescription('The BOM API description')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
