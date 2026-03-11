/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import type { PaginatedResult } from '../../../core/interfaces/paginated-result.interface';
import type { DefaultStatus } from '../../../shared/enums/status.enum';
import type { CreateBlogCommentDto } from '../dto/create-blog-comment.dto';
import type { QueryBlogCommentDto } from '../dto/query-blog-comment.dto';
import type { UpdateBlogCommentDto } from '../dto/update-blog-comment.dto';
import type { BlogComment } from '../entities/blog-comment.entity';

export abstract class IBlogCommentsService {
  abstract create(
    createBlogCommentDto: CreateBlogCommentDto,
  ): Promise<BlogComment>;
  abstract findAll(
    query: QueryBlogCommentDto,
  ): Promise<PaginatedResult<BlogComment>>;
  abstract findByBlog(
    blogId: string,
    query: QueryBlogCommentDto,
  ): Promise<PaginatedResult<BlogComment>>;
  abstract update(
    id: string,
    updateBlogCommentDto: UpdateBlogCommentDto,
  ): Promise<BlogComment>;
  abstract status(
    id: string,
    status: DefaultStatus,
    updatedBy: string,
  ): Promise<BlogComment>;
}
