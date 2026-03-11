/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import type { PaginatedResult } from '../../../core/interfaces/paginated-result.interface';
import type { DefaultStatus } from '../../../shared/enums/status.enum';
import type { CreateCategoryDto } from '../dto/create-category.dto';
import type { QueryCategoryDto } from '../dto/query-category.dto';
import type { UpdateCategoryDto } from '../dto/update-category.dto';
import type { Category } from '../entities/category.entity';

export abstract class ICategoryService {
  abstract create(createCategoryDto: CreateCategoryDto): Promise<Category>;
  abstract findAll(query: QueryCategoryDto): Promise<PaginatedResult<Category>>;
  abstract update(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category>;
  abstract status(
    id: string,
    status: DefaultStatus,
    updatedBy: string,
  ): Promise<Category>;
}
