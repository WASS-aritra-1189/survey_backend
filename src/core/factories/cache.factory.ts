/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import type { CacheModuleOptions } from '@nestjs/cache-manager';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/**
 * Cache store types - Strategy Pattern
 */
export enum CacheStoreType {
  MEMORY = 'memory',
  REDIS = 'redis',
}

/**
 * Cache Factory - Factory Pattern with Strategy Pattern
 * Creates cache configurations based on environment and requirements
 * Implements Abstract Factory for different cache stores
 */
@Injectable()
export class CacheFactory {
  constructor(private readonly configService: ConfigService) {}

  /**
   * Factory method for creating cache configuration
   * Strategy pattern - different cache strategies based on environment
   */
  createCacheConfig(): CacheModuleOptions {
    const cacheStore = this.configService.get<CacheStoreType>(
      'CACHE_STORE',
      CacheStoreType.MEMORY,
    );

    // Strategy pattern - select cache store strategy
    switch (cacheStore) {
      case CacheStoreType.REDIS:
        return this.createRedisConfig();
      default:
        return this.createMemoryConfig();
    }
  }

  /**
   * Template method for Redis cache configuration
   * Implements distributed caching for production environments
   */
  private createRedisConfig(): CacheModuleOptions {
    return {
      store: 'redis',
      host: this.configService.get<string>('REDIS_HOST', 'localhost'),
      port: this.configService.get<number>('REDIS_PORT', 6379),
      password: this.configService.get<string>('REDIS_PASSWORD'),
      db: this.configService.get<number>('REDIS_DB', 0),
      ttl: this.configService.get<number>('CACHE_TTL', 300), // 5 minutes default
      max: this.configService.get<number>('CACHE_MAX_ITEMS', 1000),
    };
  }

  /**
   * Template method for in-memory cache configuration
   * Suitable for development and single-instance deployments
   */
  private createMemoryConfig(): CacheModuleOptions {
    return {
      ttl: this.configService.get<number>('CACHE_TTL', 300), // 5 minutes default
      max: this.configService.get<number>('CACHE_MAX_ITEMS', 100), // Smaller for memory
    };
  }

  /**
   * Builder pattern for custom cache configuration
   * Provides fluent interface for cache setup
   */
  createCustomConfig(): CacheConfigBuilder {
    return new CacheConfigBuilder();
  }
}

/**
 * Cache Configuration Builder - Builder Pattern
 * Provides fluent interface for building cache configurations
 */
export class CacheConfigBuilder {
  private readonly config: Partial<CacheModuleOptions> = {};

  setStore(store: CacheStoreType): this {
    if (store === CacheStoreType.REDIS) {
      this.config.store = 'redis';
    }
    return this;
  }

  setTtl(ttl: number): this {
    this.config.ttl = ttl;
    return this;
  }

  setMaxItems(max: number): this {
    this.config.max = max;
    return this;
  }

  setRedisConnection(host: string, port: number, password?: string): this {
    Object.assign(this.config, { host, port, password });
    return this;
  }

  enableCompression(): this {
    // Implementation would add compression configuration
    return this;
  }

  build(): CacheModuleOptions {
    return this.config as CacheModuleOptions;
  }
}
