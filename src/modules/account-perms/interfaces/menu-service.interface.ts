/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import type { PaginatedResult } from '../../../core/interfaces/paginated-result.interface';
import type { DefaultStatus } from '../../../shared/enums/status.enum';
import type { CreateMenuDto } from '../dto/create-menu.dto';
import type { QueryMenuDto } from '../dto/query-menu.dto';
import type { UpdateMenuDto } from '../dto/update-menu.dto';
import type { Menu } from '../entities/menu.entity';

export abstract class IMenuService {
  abstract create(createDto: CreateMenuDto): Promise<Menu>;
  abstract findAll(query: QueryMenuDto): Promise<PaginatedResult<Menu>>;
  abstract update(id: string, updateDto: UpdateMenuDto): Promise<Menu>;
  abstract status(id: string, status: DefaultStatus, updatedBy: string): Promise<Menu>;
  abstract bulkStatus(ids: string[], status: DefaultStatus, updatedBy: string): Promise<Menu[]>;
}
