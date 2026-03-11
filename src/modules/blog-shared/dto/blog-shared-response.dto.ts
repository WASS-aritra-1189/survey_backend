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

export class BlogSharedAccountDto {
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

export class BlogSharedBlogDto {
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

export class BlogSharedResponseDto extends BaseResponseDto {
  @ApiProperty()
  @Expose()
  platform: string;

  @ApiProperty()
  @Expose()
  blogId: string;

  @ApiProperty()
  @Expose()
  accountId: string;

  @ApiProperty()
  @Expose()
  userAgent?: string;

  @ApiProperty()
  @Expose()
  settingId: string;

  @ApiProperty({ type: BlogSharedAccountDto })
  @Expose()
  @Type(() => BlogSharedAccountDto)
  account?: BlogSharedAccountDto;

  @ApiProperty({ type: BlogSharedBlogDto })
  @Expose()
  @Type(() => BlogSharedBlogDto)
  blog?: BlogSharedBlogDto;
}

export class BlogSharedListResponseDto extends PaginatedResponseDto<BlogSharedResponseDto> {
  @ApiProperty({ type: [BlogSharedResponseDto] })
  @Expose()
  declare data: BlogSharedResponseDto[];
}
