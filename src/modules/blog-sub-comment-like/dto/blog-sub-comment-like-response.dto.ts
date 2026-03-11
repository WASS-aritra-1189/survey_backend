/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import {
  BaseResponseDto,
  PaginatedResponseDto,
} from '../../../shared/dto/base-response.dto';

export class BlogSubCommentLikeAccountDto {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  firstName: string;

  @ApiProperty()
  @Expose()
  lastName: string;

  @ApiProperty()
  @Expose()
  email: string;
}

export class BlogSubCommentLikeSubCommentDto {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  content: string;
}

export class BlogSubCommentLikeResponseDto extends BaseResponseDto {
  @ApiProperty()
  @Expose()
  blogId: string;

  @ApiProperty()
  @Expose()
  blogCommentId: string;

  @ApiProperty()
  @Expose()
  blogSubCommentId: string;

  @ApiProperty()
  @Expose()
  accountId: string;

  @ApiProperty()
  @Expose()
  settingId: string;

  @ApiProperty({ type: BlogSubCommentLikeAccountDto })
  @Expose()
  @Type(() => BlogSubCommentLikeAccountDto)
  account?: BlogSubCommentLikeAccountDto;

  @ApiProperty({ type: BlogSubCommentLikeSubCommentDto })
  @Expose()
  @Type(() => BlogSubCommentLikeSubCommentDto)
  blogSubComment?: BlogSubCommentLikeSubCommentDto;
}

export class BlogSubCommentLikeListResponseDto extends PaginatedResponseDto<BlogSubCommentLikeResponseDto> {
  @ApiProperty({ type: [BlogSubCommentLikeResponseDto] })
  @Expose()
  declare data: BlogSubCommentLikeResponseDto[];
}
