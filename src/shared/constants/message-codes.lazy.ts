/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

interface MessageCode {
  code: string;
  message: string;
}
type MessageCodes = Record<string, MessageCode>;

// Lazy-loaded message codes for better performance
export const getMessageCodes = (): Promise<MessageCodes> => {
  return import('./message-codes.js').then(
    (module: { MESSAGE_CODES: MessageCodes }) => module.MESSAGE_CODES,
  );
};

// Cached version for frequent access
let cachedMessageCodes: MessageCodes | null = null;

export const getCachedMessageCodes = async (): Promise<MessageCodes> => {
  cachedMessageCodes ??= await getMessageCodes();
  return cachedMessageCodes;
};

// Get specific message code without loading all
export const getMessageCode = async (
  code: string,
): Promise<MessageCode | undefined> => {
  const codes = await getMessageCodes();
  return Object.values(codes).find((msg: MessageCode) => msg.code === code);
};
