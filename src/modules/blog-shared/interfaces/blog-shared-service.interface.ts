/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import type { PaginatedResult } from '../../../core/interfaces/paginated-result.interface';
import type { CreateBlogSharedDto } from '../dto/create-blog-shared.dto';
import type { QueryBlogSharedDto } from '../dto/query-blog-shared.dto';
import type { BlogShared } from '../entities/blog-shared.entity';

export abstract class IBlogSharedService {
  abstract create(
    createBlogSharedDto: CreateBlogSharedDto,
  ): Promise<BlogShared>;
  abstract findAll(
    query: QueryBlogSharedDto,
  ): Promise<PaginatedResult<BlogShared>>;
  abstract findByBlog(
    blogId: string,
    query: QueryBlogSharedDto,
  ): Promise<PaginatedResult<BlogShared>>;
}
