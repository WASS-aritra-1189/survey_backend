/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import type { PaginatedResult } from '../../../core/interfaces/paginated-result.interface';
import type { DefaultStatus } from '../../../shared/enums/status.enum';
import type { CreateBlogDto } from '../dto/create-blog.dto';
import type { QueryBlogDto } from '../dto/query-blog.dto';
import type { UpdateBlogDto } from '../dto/update-blog.dto';
import type { Blog } from '../entities/blog.entity';

export abstract class IBlogsService {
  abstract create(createBlogDto: CreateBlogDto): Promise<Blog>;
  abstract findAll(query: QueryBlogDto): Promise<PaginatedResult<Blog>>;
  abstract findOne(id: string): Promise<Blog>;
  abstract findBySlug(slug: string): Promise<Blog>;
  abstract update(id: string, updateBlogDto: UpdateBlogDto): Promise<Blog>;
  abstract status(
    id: string,
    status: DefaultStatus,
    updatedBy: string,
  ): Promise<Blog>;
  abstract incrementViewCount(id: string): Promise<Blog>;
}
