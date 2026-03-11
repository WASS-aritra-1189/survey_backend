/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import {
  BaseResponseDto,
  PaginatedResponseDto,
} from '../../../shared/dto/base-response.dto';
import { DefaultStatus } from '../../../shared/enums/status.enum';

export class BlogResponseDto extends BaseResponseDto {
  @ApiProperty()
  @Expose()
  title: string;

  @ApiProperty()
  @Expose()
  slug: string;

  @ApiProperty()
  @Expose()
  excerpt?: string;

  @ApiProperty()
  @Expose()
  content: string;

  @ApiProperty()
  @Expose()
  featuredImage?: string;

  @ApiProperty()
  @Expose()
  metaTitle?: string;

  @ApiProperty()
  @Expose()
  metaDescription?: string;

  @ApiProperty({ type: [String] })
  @Expose()
  tags?: string[];

  @ApiProperty({ enum: DefaultStatus })
  @Expose()
  status: DefaultStatus;

  @ApiProperty()
  @Expose()
  publishedAt?: Date;

  @ApiProperty()
  @Expose()
  viewCount: number;

  @ApiProperty()
  @Expose()
  settingId: string;
}

export class BlogDto extends BaseResponseDto {
  @ApiProperty()
  @Expose()
  title: string;

  @ApiProperty()
  @Expose()
  metaTitle?: string;

  @ApiProperty()
  @Expose()
  metaDescription?: string;

  @ApiProperty({ type: [String] })
  @Expose()
  tags?: string[];

  @ApiProperty({ enum: DefaultStatus })
  @Expose()
  status: DefaultStatus;

  @ApiProperty()
  @Expose()
  publishedAt?: Date;

  @ApiProperty()
  @Expose()
  viewCount: number;

  @ApiProperty()
  @Expose()
  settingId: string;
}

export class BlogListResponseDto extends PaginatedResponseDto<BlogDto> {
  @ApiProperty({ type: [BlogDto] })
  @Expose()
  declare data: BlogDto[];
}
