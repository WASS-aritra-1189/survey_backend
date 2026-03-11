/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions, JwtOptionsFactory } from '@nestjs/jwt';
import { getEnvOrThrow } from '../core/utils/env.utils';

/**
 * JWT Configuration - Factory Pattern with Strategy Pattern
 * Implements JWT configuration for authentication
 * Uses Strategy pattern for different JWT settings
 */
@Injectable()
export class JwtConfig implements JwtOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  /**
   * Factory method implementation for JWT configuration
   * Template method pattern for consistent JWT setup
   */
  createJwtOptions(): JwtModuleOptions {
    return {
      secret: getEnvOrThrow('JWT_SECRET'),
      signOptions: {
        expiresIn: this.configService.get('JWT_EXPIRES_IN', '1h'),
        issuer: this.configService.get('JWT_ISSUER', 'globalsports'),
        audience: this.configService.get('JWT_AUDIENCE', 'globalsports-users'),
      },
      verifyOptions: {
        issuer: this.configService.get('JWT_ISSUER', 'globalsports'),
        audience: this.configService.get('JWT_AUDIENCE', 'globalsports-users'),
      },
    };
  }
}
