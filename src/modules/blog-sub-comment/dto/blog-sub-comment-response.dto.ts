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
import { DefaultStatus } from '../../../shared/enums/status.enum';

export class BlogSubCommentAccountDto {
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

export class BlogSubCommentBlogDto {
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

export class BlogSubCommentParentDto {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  comment: string;
}

export class BlogSubCommentResponseDto extends BaseResponseDto {
  @ApiProperty()
  @Expose()
  content: string;

  @ApiProperty({ enum: DefaultStatus })
  @Expose()
  status: DefaultStatus;

  @ApiProperty()
  @Expose()
  blogId: string;

  @ApiProperty()
  @Expose()
  blogCommentId: string;

  @ApiProperty()
  @Expose()
  accountId: string;

  @ApiProperty()
  @Expose()
  settingId: string;

  @ApiProperty({ type: BlogSubCommentAccountDto })
  @Expose()
  @Type(() => BlogSubCommentAccountDto)
  account?: BlogSubCommentAccountDto;

  @ApiProperty({ type: BlogSubCommentBlogDto })
  @Expose()
  @Type(() => BlogSubCommentBlogDto)
  blog?: BlogSubCommentBlogDto;

  @ApiProperty({ type: BlogSubCommentParentDto })
  @Expose()
  @Type(() => BlogSubCommentParentDto)
  blogComment?: BlogSubCommentParentDto;
}

export class BlogSubCommentListResponseDto extends PaginatedResponseDto<BlogSubCommentResponseDto> {
  @ApiProperty({ type: [BlogSubCommentResponseDto] })
  @Expose()
  declare data: BlogSubCommentResponseDto[];
}
