/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import type { PaginatedResult } from '../../../core/interfaces/paginated-result.interface';
import type { CreateBlogSubCommentLikeDto } from '../dto/create-blog-sub-comment-like.dto';
import type { QueryBlogSubCommentLikeDto } from '../dto/query-blog-sub-comment-like.dto';
import type { BlogSubCommentLike } from '../entities/blog-sub-comment-like.entity';

export abstract class IBlogSubCommentLikeService {
  abstract create(createBlogSubCommentLikeDto: CreateBlogSubCommentLikeDto): Promise<BlogSubCommentLike>;
  abstract findAll(query: QueryBlogSubCommentLikeDto): Promise<PaginatedResult<BlogSubCommentLike>>;
  abstract findOne(id: string): Promise<BlogSubCommentLike>;
  abstract findBySubComment(blogSubCommentId: string, query: QueryBlogSubCommentLikeDto): Promise<PaginatedResult<BlogSubCommentLike>>;
  abstract findByAccount(accountId: string, query: QueryBlogSubCommentLikeDto): Promise<PaginatedResult<BlogSubCommentLike>>;
  abstract toggle(blogSubCommentId: string, accountId: string): Promise<{ liked: boolean; totalLikes: number }>;
  abstract getLikeStats(blogSubCommentId: string, accountId?: string): Promise<{ totalLikes: number; isLikedByUser: boolean }>;
  abstract remove(blogSubCommentId: string, accountId: string): Promise<void>;
}