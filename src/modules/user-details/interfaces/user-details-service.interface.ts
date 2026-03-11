/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import type { PaginatedResult } from '../../../core/interfaces/paginated-result.interface';
import type { QueryUserDetailDto } from '../dto/query-user-detail.dto';
import type { UpdateUserDetailDto } from '../dto/update-user-detail.dto';
import type { UserDetail } from '../entities/user-detail.entity';

export abstract class IUserDetailsService {
  abstract findAll(
    query: QueryUserDetailDto,
  ): Promise<PaginatedResult<UserDetail>>;
  abstract findOne(id: string): Promise<UserDetail>;
  abstract update(
    id: string,
    updateUserDetailDto: UpdateUserDetailDto,
  ): Promise<UserDetail>;
}
