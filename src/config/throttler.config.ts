/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ThrottlerModuleOptions,
  ThrottlerOptionsFactory,
} from '@nestjs/throttler';

/**
 * Throttler Configuration - Factory Pattern with Strategy Pattern
 * Implements rate limiting configuration for API protection
 * Uses Strategy pattern for different rate limiting strategies
 */
@Injectable()
export class ThrottlerConfig implements ThrottlerOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  /**
   * Factory method implementation for throttler configuration
   * Template method pattern for consistent rate limiting setup
   */
  createThrottlerOptions(): ThrottlerModuleOptions {
    const environment = this.configService.get<string>(
      'NODE_ENV',
      'development',
    );

    // Strategy pattern - different rate limits based on environment
    switch (environment) {
      case 'production':
        return this.getProductionConfig();
      case 'development':
        return this.getDevelopmentConfig();
      default:
        return this.getDefaultConfig();
    }
  }

  /**
   * Strategy implementation for production environment
   * Stricter rate limits for production security
   */
  private getProductionConfig(): ThrottlerModuleOptions {
    return [
      {
        name: 'short',
        ttl: 1000, // 1 second
        limit: 3, // 3 requests per second
      },
      {
        name: 'medium',
        ttl: 10000, // 10 seconds
        limit: 20, // 20 requests per 10 seconds
      },
      {
        name: 'long',
        ttl: 60000, // 1 minute
        limit: 100, // 100 requests per minute
      },
    ];
  }

  /**
   * Strategy implementation for development environment
   * More lenient rate limits for development
   */
  private getDevelopmentConfig(): ThrottlerModuleOptions {
    return [
      {
        name: 'short',
        ttl: 1000, // 1 second
        limit: 10, // 10 requests per second
      },
      {
        name: 'medium',
        ttl: 10000, // 10 seconds
        limit: 100, // 100 requests per 10 seconds
      },
      {
        name: 'long',
        ttl: 60000, // 1 minute
        limit: 1000, // 1000 requests per minute
      },
    ];
  }

  /**
   * Default configuration strategy
   * Balanced rate limits for general use
   */
  private getDefaultConfig(): ThrottlerModuleOptions {
    return [
      {
        ttl: this.configService.get<number>('THROTTLE_TTL', 60000), // 1 minute
        limit: this.configService.get<number>('THROTTLE_LIMIT', 60), // 60 requests per minute
      },
    ];
  }
}
