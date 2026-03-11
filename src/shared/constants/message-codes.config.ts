/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

// Configuration for message code optimization
export const MESSAGE_CONFIG = {
  // Enable lazy loading for non-critical message codes
  LAZY_LOAD_CATEGORIES: ['TRAVEL', 'HEALTH', 'EDU', 'IOT', 'LEGAL', 'LOCALE'],

  // Core message codes that should always be loaded
  CORE_CATEGORIES: ['AUTH', 'GEN', 'USER', 'PAY', 'API'],

  // Cache settings
  CACHE_TTL: 3600000, // 1 hour in milliseconds
  MAX_CACHE_SIZE: 1000,
} as const;
