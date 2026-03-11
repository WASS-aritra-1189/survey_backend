/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import type { PaginatedResult } from '../../../core/interfaces/paginated-result.interface';
import { MenuPermissionsDto } from '../dto/menu-permissions-response.dto';
import type { QueryAccountPermissionDto } from '../dto/query-account-permission.dto';
import type { UpdateAccountPermissionDto } from '../dto/update-account-permission.dto';
import type { AccountPermission } from '../entities/account-perms.entity';

export abstract class IAccountPermissionsService {
  abstract findAll(
    query: QueryAccountPermissionDto,
  ): Promise<PaginatedResult<MenuPermissionsDto>>;
  abstract update(
    updateDto: UpdateAccountPermissionDto[],
  ): Promise<UpdateAccountPermissionDto[]>;
  abstract findByAccountId(accountId: string): Promise<AccountPermission[]>;
}
