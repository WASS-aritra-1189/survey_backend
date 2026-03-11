/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import type { PaginatedResult } from '../../../core/interfaces/paginated-result.interface';
import type { DefaultStatus } from '../../../shared/enums/status.enum';
import type { CreateSubCategoryDto } from '../dto/create-sub-category.dto';
import type { QuerySubCategoryDto } from '../dto/query-sub-category.dto';
import type { UpdateSubCategoryDto } from '../dto/update-sub-category.dto';
import type { SubCategory } from '../entities/sub-category.entity';

export interface ISubCategoryService {
  create(createSubCategoryDto: CreateSubCategoryDto): Promise<SubCategory>;
  findAll(query: QuerySubCategoryDto): Promise<PaginatedResult<SubCategory>>;
  findOne(id: string): Promise<SubCategory>;
  update(
    id: string,
    updateSubCategoryDto: UpdateSubCategoryDto,
  ): Promise<SubCategory>;
  status(
    id: string,
    status: DefaultStatus,
    updatedBy: string,
  ): Promise<SubCategory>;
}
