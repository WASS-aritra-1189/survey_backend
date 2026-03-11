/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import type {
  CacheModuleOptions,
  CacheOptionsFactory,
} from '@nestjs/cache-manager';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { getEnvOrThrow } from '../core/utils/env.utils';

/**
 * Cache Configuration - Factory Pattern with Strategy Pattern
 * Implements CacheOptionsFactory for dynamic cache configuration
 * Uses Strategy pattern for different cache stores
 */
@Injectable()
export class CacheConfig implements CacheOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  /**
   * Factory method implementation for cache configuration
   * Strategy pattern - selects cache store based on environment
   */
  createCacheOptions(): CacheModuleOptions {
    const cacheStore = this.configService.get<string>('CACHE_STORE', 'memory');

    // Strategy pattern - different cache strategies
    switch (cacheStore) {
      case 'redis':
        return this.createRedisConfig();
      default:
        return this.createMemoryConfig();
    }
  }

  /**
   * Strategy implementation for Redis cache
   * Suitable for production and distributed environments
   */
  private createRedisConfig(): CacheModuleOptions {
    return {
      store: 'redis',
      host: getEnvOrThrow('REDIS_HOST'),
      port: parseInt(getEnvOrThrow('REDIS_PORT'), 10),
      password: this.configService.get<string>('REDIS_PASSWORD'),
      db: parseInt(this.configService.get<string>('REDIS_DB', '0'), 10),
      ttl: parseInt(this.configService.get<string>('CACHE_TTL', '300'), 10),
      max: parseInt(
        this.configService.get<string>('CACHE_MAX_ITEMS', '1000'),
        10,
      ),
    };
  }

  /**
   * Strategy implementation for in-memory cache
   * Suitable for development and single-instance deployments
   */
  private createMemoryConfig(): CacheModuleOptions {
    return {
      ttl: parseInt(this.configService.get<string>('CACHE_TTL', '300'), 10), // 5 minutes
      max: parseInt(
        this.configService.get<string>('CACHE_MAX_ITEMS', '100'),
        10,
      ),
    };
  }
}
