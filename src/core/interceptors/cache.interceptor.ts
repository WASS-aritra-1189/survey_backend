/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import type { Cache } from 'cache-manager';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

interface RequestWithUser {
  method: string;
  url: string;
  query?: Record<string, unknown>;
  user?: { id?: string };
}

/**
 * Cache Interceptor - Decorator Pattern with Strategy Pattern
 * Implements caching strategy for GET requests
 * Uses Proxy pattern to intercept and cache responses
 */
@Injectable()
export class CacheInterceptor implements NestInterceptor {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<unknown>> {
    const request = context.switchToHttp().getRequest<RequestWithUser>();

    // Strategy pattern - only cache GET requests
    if (request.method !== 'GET') {
      return next.handle();
    }

    // Template method pattern for cache key generation
    const cacheKey = this.generateCacheKey(request);

    // Proxy pattern - check cache before proceeding
    const cachedResponse = await this.cacheManager.get(cacheKey);
    if (cachedResponse) {
      return of(cachedResponse);
    }

    // Observer pattern - cache the response
    return next.handle().pipe(
      tap((response: unknown) => {
        void this.cacheManager.set(cacheKey, response, 300000); // 5 minutes TTL
      }),
    );
  }

  /**
   * Template method for generating consistent cache keys
   * Combines URL, query parameters, and user context
   */
  private generateCacheKey(request: RequestWithUser): string {
    const { url, query, user } = request;
    const userId = user?.id ?? 'anonymous';
    const queryString = JSON.stringify(query ?? {});
    return `cache:${url}:${userId}:${queryString}`;
  }
}
