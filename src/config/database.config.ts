/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { getEnvOrThrow } from '../core/utils/env.utils';
import type {
  TypeOrmModuleOptions,
  TypeOrmOptionsFactory,
} from '@nestjs/typeorm';
import type { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';
import type { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import type { SqliteConnectionOptions } from 'typeorm/driver/sqlite/SqliteConnectionOptions';

/**
 * Database Configuration - Factory Pattern with Strategy Pattern
 * Implements TypeOrmOptionsFactory for dynamic configuration
 * Uses Strategy pattern for environment-specific settings
 */
@Injectable()
export class DatabaseConfig implements TypeOrmOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  /**
   * Factory method implementation for TypeORM configuration
   * Template method pattern for consistent configuration structure
   */
  createTypeOrmOptions(): TypeOrmModuleOptions {
    const environment = this.configService.get<string>(
      'NODE_ENV',
      'development',
    );

    // Environment-specific configurations using Strategy pattern
    switch (environment) {
      case 'production':
        return this.getProductionConfig();
      case 'test':
        return this.getTestConfig();
      default:
        return this.getDevelopmentConfig();
    }
  }

  /**
   * Strategy implementation for production environment
   * Optimized for performance and security
   */
  private getProductionConfig():
    | PostgresConnectionOptions
    | MysqlConnectionOptions {
    const dbType = this.configService.get<'postgres' | 'mysql'>(
      'DB_TYPE',
      'postgres',
    );

    const baseConfig = {
      type: dbType,
      host: getEnvOrThrow('DB_HOST'),
      port: parseInt(getEnvOrThrow('DB_PORT'), 10),
      username: getEnvOrThrow('DB_USERNAME'),
      password: getEnvOrThrow('DB_PASSWORD'),
      database: getEnvOrThrow('DB_NAME'),
      entities: [`${__dirname}/../**/*.entity{.ts,.js}`],
      migrations: [`${__dirname}/../migrations/*{.ts,.js}`],
      subscribers: [`${__dirname}/../subscribers/*{.ts,.js}`],
      synchronize: this.configService.get<boolean>('DB_SYNCHRONIZE', false),
      logging: this.configService.get<boolean>('DB_LOGGING', false),
      // ssl: this.configService.get<boolean>('DB_SSL', true)
      //   ? {
      //       rejectUnauthorized: false,
      //     }
      //   : false,
      extra: {
        max: this.configService.get<number>('DB_MAX_CONNECTIONS', 20),
        idleTimeoutMillis: this.configService.get<number>(
          'DB_IDLE_TIMEOUT',
          30000,
        ),
        connectionTimeoutMillis: this.configService.get<number>(
          'DB_CONNECTION_TIMEOUT',
          2000,
        ),
      },
    };

    return baseConfig as PostgresConnectionOptions | MysqlConnectionOptions;
  }

  /**
   * Strategy implementation for development environment
   * Optimized for debugging and rapid development
   */
  private getDevelopmentConfig():
    | PostgresConnectionOptions
    | MysqlConnectionOptions {
    const dbType = this.configService.get<'postgres' | 'mysql'>(
      'DB_TYPE',
      'postgres',
    );
    const defaultPort = dbType === 'mysql' ? 3306 : 5432;

    const baseConfig = {
      type: dbType,
      host: this.configService.get<string>('DB_HOST', 'localhost'),
      port: this.configService.get<number>('DB_PORT', defaultPort),
      username: this.configService.get<string>(
        'DB_USERNAME',
        dbType === 'mysql' ? 'root' : 'postgres',
      ),
      password: this.configService.get<string>('DB_PASSWORD', 'password'),
      database: this.configService.get<string>('DB_NAME', 'globalsports_dev'),
      entities: [`${__dirname}/../**/*.entity{.ts,.js}`],
      migrations: [`${__dirname}/../migrations/*{.ts,.js}`],
      subscribers: [`${__dirname}/../subscribers/*{.ts,.js}`],
      synchronize: this.configService.get<boolean>('DB_SYNCHRONIZE', true),
      logging: this.configService.get<boolean>('DB_LOGGING', true),
      // ssl: this.configService.get<boolean>('DB_SSL', false)
      //   ? {
      //       rejectUnauthorized: false,
      //     }
      //   : false,
      extra: {
        max: this.configService.get<number>('DB_MAX_CONNECTIONS', 20),
        idleTimeoutMillis: this.configService.get<number>(
          'DB_IDLE_TIMEOUT',
          30000,
        ),
        connectionTimeoutMillis: this.configService.get<number>(
          'DB_CONNECTION_TIMEOUT',
          2000,
        ),
      },
    };

    return baseConfig as PostgresConnectionOptions | MysqlConnectionOptions;
  }

  /**
   * Strategy implementation for test environment
   * Optimized for fast test execution
   */
  private getTestConfig(): SqliteConnectionOptions {
    return {
      type: this.configService.get<'sqlite'>('TEST_DB_TYPE', 'sqlite'),
      database: ':memory:', // In-memory database for tests
      entities: [`${__dirname}/../**/*.entity{.ts,.js}`],
      synchronize: this.configService.get<boolean>('DB_SYNCHRONIZE', true),
      logging: false,
      dropSchema: true, // Clean slate for each test run
    };
  }
}
