/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { MessageType } from '../enums/message-type.enum';
import { getMessageByCode } from './message-cache.util';

export interface IApiResponse<T = unknown> {
  success: boolean;
  messageId: string;
  messageType: MessageType;
  data?: T;
}

export function createSuccessResponse<T>(
  messageCode: { code: string; message: string },
  messageType: MessageType = MessageType.SUCCESS,
  data?: T,
): IApiResponse<T> {
  return {
    success: true,
    messageId: messageCode.code,
    messageType,
    data,
  };
}

export function createErrorResponse(
  messageCode: { code: string; message: string },
  messageType: MessageType = MessageType.ERROR,
): IApiResponse {
  return {
    success: false,
    messageId: messageCode.code,
    messageType,
  };
}

// Optimized version using cached lookup
export function createResponseByCode<T = unknown>(
  messageCodeId: string,
  messageType: MessageType,
  data?: T,
): IApiResponse<T> {
  const messageCode = getMessageByCode(messageCodeId);
  if (!messageCode) {
    throw new Error(`Message code ${messageCodeId} not found`);
  }

  return {
    success: messageType === MessageType.SUCCESS,
    messageId: messageCode.code,
    messageType,
    ...(data && { data }),
  };
}
