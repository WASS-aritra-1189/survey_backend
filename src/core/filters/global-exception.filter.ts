/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { FastifyReply } from 'fastify';
import { MESSAGE_CODES } from '../../shared/constants/message-codes';
import { MessageType } from '../../shared/enums/message-type.enum';
import { CustomException } from '../../shared/exceptions/custom.exception';
import {
  createErrorResponse,
  type IApiResponse,
} from '../../shared/utils/response.util';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse<FastifyReply>();

    this.logger.error(
      `[EXCEPTION] ${request.method} ${request.url} - ${exception instanceof Error ? exception.message : 'Unknown error'}`,
      exception instanceof Error ? exception.stack : '',
    );

    const errorDetails = this.getErrorDetails(exception);

    this.logger.error(
      `[EXCEPTION] Response: ${JSON.stringify(errorDetails.errorResponse)}`,
    );

    void response.status(errorDetails.status).send(errorDetails.errorResponse);
  }

  private getErrorDetails(exception: unknown): {
    status: number;
    errorResponse: IApiResponse;
  } {
    if (exception instanceof CustomException) {
      return {
        status: exception.getStatus(),
        errorResponse: {
          ...createErrorResponse(
            exception.messageCode,
            exception.messageType,
          ),
          data: { message: exception.messageCode.message },
        },
      };
    }

    if (exception instanceof HttpException) {
      const response = exception.getResponse();
      const errors =
        typeof response === 'object' && 'message' in response
          ? Array.isArray(response.message)
            ? response.message
            : [response.message]
          : [];

      return {
        status: exception.getStatus(),
        errorResponse: {
          ...createErrorResponse(
            MESSAGE_CODES.VALIDATION_ERROR,
            MessageType.ERROR,
          ),
          data: { errors },
        },
      };
    }

    return {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      errorResponse: createErrorResponse(
        MESSAGE_CODES.INTERNAL_ERROR,
        MessageType.ERROR,
      ),
    };
  }
}
