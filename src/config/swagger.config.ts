/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { NestFastifyApplication } from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

@Injectable()
export class SwaggerConfig {
  constructor(private readonly configService: ConfigService) {}

  setupSwagger(app: NestFastifyApplication): void {
    const isEnabled = this.configService.get<boolean>('SWAGGER_ENABLED', true);

    if (!isEnabled) {
      return;
    }

    const config = new DocumentBuilder()
      .setTitle(
        this.configService.get<string>(
          'SWAGGER_TITLE',
          'Nirvana360 Platform API',
        ),
      )
      .setDescription(
        this.configService.get<string>(
          'SWAGGER_DESCRIPTION',
          'API documentation for Nirvana360 Platform platform',
        ),
      )
      .setVersion(this.configService.get<string>('SWAGGER_VERSION', '1.0.0'))
      .addBearerAuth()
      .addTag('auth', 'Authentication endpoints')
      .addTag('account', 'Account management')
      .addTag('settings', 'System settings')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    const swaggerPath = this.configService.get<string>(
      'SWAGGER_PATH',
      'api/docs',
    );

    SwaggerModule.setup(swaggerPath, app, document, {
      swaggerOptions: {
        persistAuthorization: true,
      },
    });
  }
}
