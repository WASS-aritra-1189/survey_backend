/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import type { PaginatedResult } from '../../../core/interfaces/paginated-result.interface';
import type { CreateBlogLikeDto } from '../dto/create-blog-like.dto';
import type { QueryBlogLikeDto } from '../dto/query-blog-like.dto';
import type { BlogLike } from '../entities/blog-like.entity';

export abstract class IBlogLikesService {
  abstract likeDislike(createBlogLikeDto: CreateBlogLikeDto): Promise<BlogLike>;
  abstract findAll(query: QueryBlogLikeDto): Promise<PaginatedResult<BlogLike>>;
  abstract findByBlog(
    blogId: string,
    query: QueryBlogLikeDto,
  ): Promise<PaginatedResult<BlogLike>>;
}
