/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { Injectable } from '@nestjs/common';
import { ThrottlerGuard as BaseThrottlerGuard } from '@nestjs/throttler';

/**
 * Custom Throttler Guard - Decorator Pattern extending base functionality
 * Implements rate limiting with custom logic
 * Uses Template Method pattern for extensible throttling behavior
 */
@Injectable()
export class ThrottlerGuard extends BaseThrottlerGuard {
  /**
   * Template method pattern - allows customization of rate limiting logic
   * Strategy pattern - different throttling strategies based on context
   */
  protected getTracker(req: Record<string, unknown>): Promise<string> {
    // Strategy pattern - use different tracking methods based on user authentication
    const user = req.user as { id?: string } | undefined;
    if (user?.id) {
      // Authenticated users tracked by user ID
      return Promise.resolve(`user:${user.id}`);
    }

    // Anonymous users tracked by IP address
    const ip = req.ip as string | undefined;
    const connection = req.connection as { remoteAddress?: string } | undefined;
    return Promise.resolve(ip ?? connection?.remoteAddress ?? 'unknown');
  }

  /**
   * Template method for custom error handling
   * Provides consistent error responses for rate limiting
   */
  protected throwThrottlingException(): Promise<void> {
    throw new Error('Too many requests. Please try again later.');
  }
}
