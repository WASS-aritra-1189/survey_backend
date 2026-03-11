/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { MESSAGE_CODES } from '../constants/message-codes';

// Message code cache for O(1) lookup
const messageCodeMap = new Map<string, { code: string; message: string }>();

// Initialize cache on first use
let isInitialized = false;

const initializeCache = (): void => {
  if (isInitialized) return;

  Object.values(MESSAGE_CODES).forEach(msg => {
    messageCodeMap.set(msg.code, msg);
  });

  isInitialized = true;
};

export const getMessageByCode = (
  code: string,
): { code: string; message: string } | undefined => {
  initializeCache();
  return messageCodeMap.get(code);
};

export const clearMessageCache = (): void => {
  messageCodeMap.clear();
  isInitialized = false;
};
