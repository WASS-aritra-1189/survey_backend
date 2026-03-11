/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface ResponseWithStatus {
  statusCode?: number;
}

/**
 * Response interface for standardized API responses
 * Implements consistent data structure across all endpoints
 */
export interface Response<T> {
  data: T;
  message: string;
  statusCode: number;
  timestamp: string;
}

/**
 * Transform Interceptor - Decorator Pattern
 * Standardizes all API responses with consistent structure
 * Implements Template Method pattern for response formatting
 */
@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    const response = context.switchToHttp().getResponse<ResponseWithStatus>();

    return next.handle().pipe(
      map((data: T) => ({
        data,
        message: 'Success',
        statusCode: response.statusCode ?? 200,
        timestamp: new Date().toISOString(),
      })),
    );
  }
}
