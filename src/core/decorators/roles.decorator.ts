/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { SetMetadata } from '@nestjs/common';
import { UserRoles } from '../../shared/enums/accouts.enum';

/**
 * Roles decorator metadata key
 * Used by RolesGuard to determine required roles
 */
export const ROLES_KEY = 'roles';

/**
 * Roles decorator - Decorator Pattern with Factory Pattern
 * Assigns required roles to routes or controllers
 * Implements metadata-driven authorization
 */
export const Roles = (...roles: string[]): MethodDecorator & ClassDecorator =>
  SetMetadata(ROLES_KEY, roles);
