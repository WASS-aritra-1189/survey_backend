/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import compression from '@fastify/compress';
import helmet from '@fastify/helmet';
import multipart from '@fastify/multipart';
import fastifyStatic from '@fastify/static';
import { join } from 'path';
import {
  ValidationPipe,
  type ExceptionFilter,
  type NestInterceptor,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  type NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { SwaggerConfig } from './config/swagger.config';
import { GlobalExceptionFilter } from './core/filters/global-exception.filter';
import { LoggingInterceptor } from './core/interceptors/logging.interceptor';
import { ResponseInterceptor } from './core/interceptors/response.interceptor';

/**
 * Bootstrap function - Factory Pattern implementation
 * Creates and configures the NestJS application with Fastify
 * Implements Dependency Injection and Inversion of Control principles
 */
async function configureApp(app: NestFastifyApplication): Promise<void> {
  // Serve static files from uploads directory
  await app.register(fastifyStatic as never, {
    root: join(process.cwd(), 'uploads'),
    prefix: '/uploads/',
  });

  // Register multipart for file uploads
  await app.register(multipart as never, {
    limits: {
      fileSize: 100 * 1024 * 1024, // 10MB
    },
  });

  // Security and compression middleware
  await app.register(helmet as never, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: [`'self'`],
        styleSrc: [`'self'`, `'unsafe-inline'`, 'https://fonts.googleapis.com'],
        scriptSrc: [`'self'`, `'unsafe-inline'`, `'unsafe-eval'`],
        imgSrc: [`'self'`, 'data:', 'https:'],
        fontSrc: [`'self'`, 'https://fonts.gstatic.com'],
        connectSrc: [`'self'`],
      },
    },
  });
  await app.register(compression as never, { encodings: ['gzip', 'deflate'] });

  // Global pipes, filters, and interceptors
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  app.useGlobalFilters(new GlobalExceptionFilter() as ExceptionFilter);

  app.useGlobalInterceptors(
    new LoggingInterceptor() as NestInterceptor,
    new ResponseInterceptor(app.get('Reflector')) as NestInterceptor,
  );
}

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: true, trustProxy: true }),
  );

  const configService = app.get(ConfigService);

  // Set global API prefix
  const apiPrefix = configService.get<string>('API_PREFIX', 'api/v1');
  app.setGlobalPrefix(apiPrefix);

  await configureApp(app);

  // Setup Swagger documentation
  const swaggerConfig = new SwaggerConfig(configService);
  swaggerConfig.setupSwagger(app);

  app.enableCors({
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'],
    credentials: true,
  });

  const port = configService.get<number>('PORT', 7000);
  await app.listen(port, '0.0.0.0');

  const swaggerPath = configService.get<string>('SWAGGER_PATH', 'swagger');
  const isSwaggerEnabled = configService.get<boolean>('SWAGGER_ENABLED', true);

  console.log(`🚀 Application running on: http://localhost:${port.toString()}`);
  console.log(
    `🔗 API available at: http://localhost:${port.toString()}/${apiPrefix}`,
  );
  if (isSwaggerEnabled) {
    console.log(
      `📚 Swagger docs available at: http://localhost:${port.toString()}/${swaggerPath}`,
    );
  }
}

void bootstrap();
