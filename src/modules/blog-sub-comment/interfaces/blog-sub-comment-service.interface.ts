/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import type { PaginatedResult } from '../../../core/interfaces/paginated-result.interface';
import type { DefaultStatus } from '../../../shared/enums/status.enum';
import type { CreateBlogSubCommentDto } from '../dto/create-blog-sub-comment.dto';
import type { QueryBlogSubCommentDto } from '../dto/query-blog-sub-comment.dto';
import type { UpdateBlogSubCommentDto } from '../dto/update-blog-sub-comment.dto';
import type { BlogSubComment } from '../entities/blog-sub-comment.entity';

export abstract class IBlogSubCommentService {
  abstract create(
    createBlogSubCommentDto: CreateBlogSubCommentDto,
  ): Promise<BlogSubComment>;
  abstract findAll(
    query: QueryBlogSubCommentDto,
  ): Promise<PaginatedResult<BlogSubComment>>;
  abstract findByBlog(
    blogId: string,
    query: QueryBlogSubCommentDto,
  ): Promise<PaginatedResult<BlogSubComment>>;
  abstract findByComment(
    blogCommentId: string,
    query: QueryBlogSubCommentDto,
  ): Promise<PaginatedResult<BlogSubComment>>;
  abstract update(
    id: string,
    updateBlogSubCommentDto: UpdateBlogSubCommentDto,
  ): Promise<BlogSubComment>;
  abstract status(
    id: string,
    status: DefaultStatus,
    updatedBy: string,
  ): Promise<BlogSubComment>;
}
