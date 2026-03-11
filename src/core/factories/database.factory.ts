/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { TypeOrmModuleOptions } from '@nestjs/typeorm';

/**
 * Database connection types - Strategy Pattern
 */
export enum DatabaseType {
  POSTGRES = 'postgres',
  MYSQL = 'mysql',
  SQLITE = 'sqlite',
}

/**
 * Database Factory - Factory Pattern with Strategy Pattern
 * Creates database configurations based on environment
 * Implements Abstract Factory for different database types
 */
@Injectable()
export class DatabaseFactory {
  constructor(private readonly configService: ConfigService) {}

  /**
   * Factory method for creating database configuration
   * Strategy pattern - different configurations for different environments
   */
  createDatabaseConfig(): TypeOrmModuleOptions {
    const environment = this.configService.get<string>(
      'NODE_ENV',
      'development',
    );

    // Strategy pattern - select configuration strategy based on environment
    switch (environment) {
      case 'production':
        return this.createProductionConfig();
      case 'test':
        return this.createTestConfig();
      default:
        return this.createDevelopmentConfig();
    }
  }

  /**
   * Template method for production database configuration
   * Implements security and performance optimizations
   */
  private createProductionConfig(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: this.configService.get('DB_HOST'),
      port: this.configService.get('DB_PORT', 5432),
      username: this.configService.get('DB_USERNAME'),
      password: this.configService.get('DB_PASSWORD'),
      database: this.configService.get('DB_NAME'),
      entities: [`${__dirname}/../../**/*.entity{.ts,.js}`],
      synchronize: false, // Never sync in production
      logging: false,
      ssl: {
        rejectUnauthorized: false,
      },
      extra: {
        max: 20, // Connection pool size
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
      },
    };
  }

  /**
   * Template method for development database configuration
   * Enables debugging and auto-synchronization
   */
  private createDevelopmentConfig(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: this.configService.get('DB_HOST', 'localhost'),
      port: this.configService.get('DB_PORT', 5432),
      username: this.configService.get('DB_USERNAME', 'postgres'),
      password: this.configService.get('DB_PASSWORD', 'password'),
      database: this.configService.get('DB_NAME', 'globalsports_dev'),
      entities: [`${__dirname}/../../**/*.entity{.ts,.js}`],
      synchronize: true, // Auto-sync for development
      logging: true,
      dropSchema: false,
    };
  }

  /**
   * Template method for test database configuration
   * Uses in-memory database for fast testing
   */
  private createTestConfig(): TypeOrmModuleOptions {
    return {
      type: 'sqlite',
      database: ':memory:',
      entities: [`${__dirname}/../../**/*.entity{.ts,.js}`],
      synchronize: true,
      logging: false,
      dropSchema: true,
    };
  }

  /**
   * Builder pattern for custom database configuration
   * Allows step-by-step configuration building
   */
  createCustomConfig(): DatabaseConfigBuilder {
    return new DatabaseConfigBuilder();
  }
}

/**
 * Database Configuration Builder - Builder Pattern
 * Provides fluent interface for building database configurations
 */
export class DatabaseConfigBuilder {
  private readonly config: Record<string, unknown> = {};

  setType(type: DatabaseType): this {
    this.config.type = type;
    return this;
  }

  setHost(host: string): this {
    this.config.host = host;
    return this;
  }

  setPort(port: number): this {
    this.config.port = port;
    return this;
  }

  setDatabase(database: string): this {
    this.config.database = database;
    return this;
  }

  setCredentials(username: string, password: string): this {
    this.config.username = username;
    this.config.password = password;
    return this;
  }

  enableLogging(enabled = true): this {
    this.config.logging = enabled;
    return this;
  }

  enableSynchronize(enabled = true): this {
    this.config.synchronize = enabled;
    return this;
  }

  build(): TypeOrmModuleOptions {
    return {
      entities: [`${__dirname}/../../**/*.entity{.ts,.js}`],
      ...this.config,
    } as TypeOrmModuleOptions;
  }
}
