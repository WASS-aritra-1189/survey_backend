/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import type { Cache } from 'cache-manager';

@Injectable()
export class CacheService {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  async set(key: string, value: unknown, ttlSeconds = 300): Promise<void> {
    await this.cacheManager.set(key, value, ttlSeconds * 1000);
  }

  async get<T>(key: string): Promise<T | null> {
    const result = await this.cacheManager.get<T>(key);
    return result ?? null;
  }

  async del(key: string): Promise<void> {
    await this.cacheManager.del(key);
  }

  async reset(): Promise<void> {
    await this.cacheManager.reset();
  }

  getKeys(pattern: string): Promise<string[]> {
    const store = this.cacheManager.store as {
      keys?: (pattern: string) => Promise<string[]>;
    };
    if (store.keys) {
      return store.keys(pattern);
    }
    return Promise.resolve([]);
  }

  async mget<T>(...keys: string[]): Promise<T[]> {
    const store = this.cacheManager.store as {
      mget?: (...keys: string[]) => Promise<T[]>;
    };
    if (store.mget) {
      return store.mget(...keys);
    }
    const results = await Promise.all(keys.map(key => this.get<T>(key)));
    return results.filter(result => result !== null) as T[];
  }

  async mset(
    keyValuePairs: Array<[string, unknown]>,
    ttlSeconds = 300,
  ): Promise<void> {
    await Promise.all(
      keyValuePairs.map(([key, value]) => this.set(key, value, ttlSeconds)),
    );
  }

  async exists(key: string): Promise<boolean> {
    const value = await this.get(key);
    return value !== null;
  }

  async increment(key: string, amount = 1): Promise<number> {
    const store = this.cacheManager.store as {
      incr?: (key: string, amount: number) => Promise<number>;
    };
    if (store.incr) {
      return store.incr(key, amount);
    }

    const current = (await this.get<number>(key)) ?? 0;
    const newValue = current + amount;
    await this.set(key, newValue);
    return newValue;
  }

  async expire(key: string, ttlSeconds: number): Promise<void> {
    const value = await this.get(key);
    if (value !== null) {
      await this.set(key, value, ttlSeconds);
    }
  }
}
