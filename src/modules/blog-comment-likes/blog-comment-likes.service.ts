/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { Injectable } from '@nestjs/common';
import { CreateBlogCommentLikeDto } from './dto/create-blog-comment-like.dto';
import { UpdateBlogCommentLikeDto } from './dto/update-blog-comment-like.dto';

@Injectable()
export class BlogCommentLikesService {
  create(createBlogCommentLikeDto: CreateBlogCommentLikeDto) {
    return 'This action adds a new blogCommentLike';
  }

  findAll() {
    return `This action returns all blogCommentLikes`;
  }

  findOne(id: number) {
    return `This action returns a #${id} blogCommentLike`;
  }

  update(id: number, updateBlogCommentLikeDto: UpdateBlogCommentLikeDto) {
    return `This action updates a #${id} blogCommentLike`;
  }

  remove(id: number) {
    return `This action removes a #${id} blogCommentLike`;
  }
}
