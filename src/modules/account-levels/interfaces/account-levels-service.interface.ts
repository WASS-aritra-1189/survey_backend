/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import type { PaginatedResult } from '../../../core/interfaces/paginated-result.interface';
import type { DefaultStatus } from '../../../shared/enums/status.enum';
import type { CreateAccountLevelDto } from '../dto/create-account-level.dto';
import type { QueryAccountLevelDto } from '../dto/query-account-level.dto';
import type { UpdateAccountLevelDto } from '../dto/update-account-level.dto';
import type { AccountLevel } from '../entities/account-level.entity';

export abstract class IAccountLevelsService {
  abstract create(createAccountLevelDto: CreateAccountLevelDto): Promise<AccountLevel>;
  abstract findAll(query: QueryAccountLevelDto): Promise<PaginatedResult<AccountLevel>>;
  abstract update(
    id: string,
    updateAccountLevelDto: UpdateAccountLevelDto,
  ): Promise<AccountLevel>;
  abstract status(
    id: string,
    status: DefaultStatus,
    updatedBy: string,
  ): Promise<AccountLevel>;
}
