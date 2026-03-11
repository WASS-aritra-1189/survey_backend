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

export class BlogLikeAccountDto {
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

  @ApiProperty()
  @Expose()
  profileImage?: string;
}

export class BlogLikeBlogDto {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  title: string;

  @ApiProperty()
  @Expose()
  slug: string;
}

export class BlogLikeResponseDto extends BaseResponseDto {
  @ApiProperty()
  @Expose()
  blogId: string;

  @ApiProperty()
  @Expose()
  accountId: string;

  @ApiProperty()
  @Expose()
  settingId: string;

  @ApiProperty({ type: BlogLikeAccountDto })
  @Expose()
  @Type(() => BlogLikeAccountDto)
  account?: BlogLikeAccountDto;

  @ApiProperty({ type: BlogLikeBlogDto })
  @Expose()
  @Type(() => BlogLikeBlogDto)
  blog?: BlogLikeBlogDto;
}

export class BlogLikeListResponseDto extends PaginatedResponseDto<BlogLikeResponseDto> {
  @ApiProperty({ type: [BlogLikeResponseDto] })
  @Expose()
  declare data: BlogLikeResponseDto[];
}

export class BlogLikeStatsDto {
  @ApiProperty()
  @Expose()
  blogId: string;

  @ApiProperty()
  @Expose()
  totalLikes: number;

  @ApiProperty()
  @Expose()
  isLikedByUser: boolean;
}