/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { SetMetadata } from '@nestjs/common';
import type { PermissionType } from '../../shared/enums/permissions.enum';

export const Permissions = (
  action: PermissionType,
  menuName: string,
): MethodDecorator => SetMetadata('permissions', [{ menuName, action }]);

export const RequirePermissions = (
  permissions: Array<{ menuName: string; action: PermissionType }>,
): MethodDecorator => SetMetadata('permissions', permissions);
