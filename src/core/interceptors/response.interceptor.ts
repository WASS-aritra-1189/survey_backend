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
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MessageType } from '../../shared/enums/message-type.enum';
import {
  createResponseByCode,
  type IApiResponse,
} from '../../shared/utils/response.util';
import { RESPONSE_MESSAGE_KEY } from '../decorators/response-message.decorator';

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, IApiResponse<T>>
{
  private readonly logger = new Logger(ResponseInterceptor.name);

  constructor(private readonly reflector: Reflector) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<IApiResponse<T>> {
    const request = context.switchToHttp().getRequest();
    this.logger.log(`[INTERCEPTOR] ${request.method} ${request.url}`);

    return next.handle().pipe(
      map((data: T) => {
        // Get custom message code from decorator or use default
        const messageCode =
          this.reflector.get<string>(
            RESPONSE_MESSAGE_KEY,
            context.getHandler(),
          ) || 'GEN_001';

        this.logger.log(`[INTERCEPTOR] Message code: ${messageCode}`);

        // If blank message code, return minimal response
        if (messageCode === '') {
          return {
            success: true,
            messageId: '',
            messageType: MessageType.SUCCESS,
            data,
          };
        }

        const response = createResponseByCode(messageCode, MessageType.SUCCESS, data);
        this.logger.log(`[INTERCEPTOR] Response: ${JSON.stringify(response)}`);
        return response;
      }),
    );
  }
}
