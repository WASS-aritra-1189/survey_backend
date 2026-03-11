/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import type { PaginatedResult } from '../../../core/interfaces/paginated-result.interface';
import type { UserStatus } from '../../../shared/enums/status.enum';
import type { QueryAccountDto } from '../dto/query-account.dto';
import type { UpdatePasswordDto } from '../dto/update-password.dto';
import type { Account } from '../entities/account.entity';

export abstract class IAccountsService {
  abstract findAll(query: QueryAccountDto): Promise<PaginatedResult<Account>>;
  abstract resetPassword(
    id: string,
    body: UpdatePasswordDto,
    updatedBy: string,
  ): Promise<Account>;
  abstract status(id: string, status: UserStatus, updatedBy: string): Promise<Account>;
  abstract update(id: string, loginId: string, updatedBy: string): Promise<Account>;
}
