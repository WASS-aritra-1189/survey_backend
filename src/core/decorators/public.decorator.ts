/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { SetMetadata } from '@nestjs/common';

/**
 * Public route decorator - Decorator Pattern
 * Marks routes as publicly accessible (no authentication required)
 * Uses metadata to communicate with guards
 */
export const IS_PUBLIC_KEY = 'isPublic';

/**
 * Public decorator factory - Factory Pattern
 * Creates metadata decorator for public routes
 */
export const Public = (): MethodDecorator & ClassDecorator =>
  SetMetadata(IS_PUBLIC_KEY, true);
