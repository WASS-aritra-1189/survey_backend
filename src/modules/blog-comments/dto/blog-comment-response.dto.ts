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

export class BlogCommentAccountDto {
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

export class BlogCommentBlogDto {
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

export class BlogCommentResponseDto extends BaseResponseDto {
  @ApiProperty()
  @Expose()
  comment: string;

  @ApiProperty({ enum: DefaultStatus })
  @Expose()
  status: DefaultStatus;

  @ApiProperty()
  @Expose()
  blogId: string;

  @ApiProperty()
  @Expose()
  accountId: string;

  @ApiProperty()
  @Expose()
  settingId: string;

  @ApiProperty({ type: BlogCommentAccountDto })
  @Expose()
  @Type(() => BlogCommentAccountDto)
  account?: BlogCommentAccountDto;

  @ApiProperty({ type: BlogCommentBlogDto })
  @Expose()
  @Type(() => BlogCommentBlogDto)
  blog?: BlogCommentBlogDto;
}

export class BlogCommentListResponseDto extends PaginatedResponseDto<BlogCommentResponseDto> {
  @ApiProperty({ type: [BlogCommentResponseDto] })
  @Expose()
  declare data: BlogCommentResponseDto[];
}
