/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import type { PaginatedResult } from '../../../core/interfaces/paginated-result.interface';
import type { QueryStaffDetailDto } from '../dto/query-staff-detail.dto';
import type { UpdateStaffDetailDto } from '../dto/update-staff-detail.dto';
import type { CreateStaffDetailDto } from '../dto/create-staff-detail.dto';
import type { StaffDetail } from '../entities/staff-detail.entity';

export abstract class IStaffDetailsService {
  abstract findAll(
    query: QueryStaffDetailDto,
  ): Promise<PaginatedResult<StaffDetail>>;
  abstract create(createDto: CreateStaffDetailDto): Promise<StaffDetail>;
  abstract findOne(id: string): Promise<StaffDetail>;
  abstract findMe(accountId: string): Promise<StaffDetail>;
  abstract findProfileById(accountId: string): Promise<StaffDetail | any>;
  abstract update(
    id: string,
    updateStaffDetailDto: UpdateStaffDetailDto,
  ): Promise<StaffDetail>;
}
