/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { Global, Module } from '@nestjs/common';

// Utilities
import { DateUtils } from './utils/date.utils';
import { StringUtils } from './utils/string.utils';

/**
 * Shared Module - Provides common utilities and helpers
 * Implements Utility Pattern for reusable functionality
 * Global module ensures availability across all modules
 */
@Global()
@Module({
  providers: [
    // Utility classes - Utility Pattern
    DateUtils,
    StringUtils,
  ],
  exports: [
    // Export utilities for use in other modules
    DateUtils,
    StringUtils,
  ],
})
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class SharedModule {}
