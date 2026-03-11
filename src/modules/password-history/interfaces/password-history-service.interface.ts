/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import type { PaginatedResult } from '../../../core/interfaces/paginated-result.interface';
import type { DefaultStatus } from '../../../shared/enums/status.enum';
import type { CreatePasswordHistoryDto } from '../dto/create-password-history.dto';
import type { QueryPasswordHistoryDto } from '../dto/query-password-history.dto';
import type { UpdatePasswordHistoryDto } from '../dto/update-password-history.dto';
import type { PasswordHistory } from '../entities/password-history.entity';

export abstract class IPasswordHistoryService {
  abstract create(createPasswordHistoryDto: CreatePasswordHistoryDto): Promise<PasswordHistory>;
  abstract findAll(query: QueryPasswordHistoryDto): Promise<PaginatedResult<PasswordHistory>>;
  abstract findOne(id: string): Promise<PasswordHistory>;
  abstract findByAccount(accountId: string, query: QueryPasswordHistoryDto): Promise<PaginatedResult<PasswordHistory>>;
  abstract status(id: string, status: DefaultStatus, updatedBy: string): Promise<PasswordHistory>;
}
