/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { Injectable, LoggerService as NestLoggerService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { promises as fs } from 'fs';
import { join } from 'path';

/**
 * Logger Service - Simple implementation without Winston
 * Environment-based logging configuration
 */
@Injectable()
export class LoggerService implements NestLoggerService {
  private readonly isProduction: boolean;

  constructor(private readonly configService: ConfigService) {
    this.isProduction =
      this.configService.get<string>('NODE_ENV') === 'production';

    if (this.isProduction) {
      this.initializeLogCleanup();
    }
  }

  log(message: string, context?: string): void {
    if (!this.isProduction) {
      const ctx = context ? `[${context}]` : '';
      console.log(`${new Date().toISOString()} INFO ${ctx} ${message}`);
    }
  }

  error(message: string, trace?: string, context?: string): void {
    const ctx = context ? `[${context}]` : '';
    const errorMsg = `${new Date().toISOString()} ERROR ${ctx} ${message}`;

    if (this.isProduction) {
      void this.writeToFile(errorMsg + (trace ? `\n${trace}` : ''));
    } else {
      console.error(errorMsg);
      if (trace) {
        console.error(trace);
      }
    }
  }

  warn(message: string, context?: string): void {
    if (!this.isProduction) {
      const ctx = context ? `[${context}]` : '';
      console.warn(`${new Date().toISOString()} WARN ${ctx} ${message}`);
    }
  }

  debug(message: string, context?: string): void {
    if (!this.isProduction) {
      const ctx = context ? `[${context}]` : '';
      console.debug(`${new Date().toISOString()} DEBUG ${ctx} ${message}`);
    }
  }

  verbose(message: string, context?: string): void {
    if (!this.isProduction) {
      const ctx = context ? `[${context}]` : '';
      console.log(`${new Date().toISOString()} VERBOSE ${ctx} ${message}`);
    }
  }

  private async writeToFile(message: string): Promise<void> {
    try {
      const logDir = 'logs';
      const logFile = join(
        logDir,
        `error-${new Date().toISOString().split('T')[0]}.log`,
      );

      await fs.mkdir(logDir, { recursive: true });
      await fs.appendFile(logFile, `${message}\n`);
    } catch {
      // Fallback to console if file write fails
      console.error(message);
    }
  }

  private initializeLogCleanup(): void {
    // Clean up old logs on startup
    void this.cleanupOldLogs();

    // Schedule daily cleanup
    setInterval(
      () => {
        void this.cleanupOldLogs();
      },
      24 * 60 * 60 * 1000,
    ); // 24 hours
  }

  private async cleanupOldLogs(): Promise<void> {
    try {
      const logDir = 'logs';
      const files = await fs.readdir(logDir);
      const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

      for (const file of files) {
        if (file.endsWith('.log')) {
          const filePath = join(logDir, file);
          const stats = await fs.stat(filePath);

          if (stats.mtime.getTime() < oneWeekAgo) {
            await fs.unlink(filePath);
          }
        }
      }
    } catch {
      // Ignore cleanup errors
    }
  }
}
