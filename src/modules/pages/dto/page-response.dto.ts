/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import {
  BaseResponseDto,
  PaginatedResponseDto,
} from '../../../shared/dto/base-response.dto';
import { PageType } from '../../../shared/enums/page.enum';
import { DefaultStatus } from '../../../shared/enums/status.enum';

export class PageResponseDto extends BaseResponseDto {
  @ApiProperty()
  @Expose()
  title: string;

  @ApiProperty({ enum: PageType })
  @Expose()
  pageType: PageType;

  @ApiProperty()
  @Expose()
  slug: string;

  @ApiProperty()
  @Expose()
  description: string;

  @ApiProperty()
  @Expose()
  content: string;

  @ApiProperty()
  @Expose()
  metaTitle: string;

  @ApiProperty()
  @Expose()
  metaDescription: string;

  @ApiProperty()
  @Expose()
  metaKeywords: string;

  @ApiProperty()
  @Expose()
  ogImage: string;

  @ApiProperty()
  @Expose()
  ogTitle: string;

  @ApiProperty()
  @Expose()
  ogDescription: string;

  @ApiProperty()
  @Expose()
  canonicalUrl: string;

  @ApiProperty()
  @Expose()
  structuredData: object;

  @ApiProperty({ enum: DefaultStatus })
  @Expose()
  status: DefaultStatus;

  @Exclude()
  settingId: string;
}

export class PageListResponseDto extends PaginatedResponseDto<PageResponseDto> {
  @ApiProperty({ type: [PageResponseDto] })
  @Expose()
  declare data: PageResponseDto[];
}

export class PublicPageResponseDto {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  title: string;

  @ApiProperty()
  @Expose()
  slug: string;

  @ApiProperty()
  @Expose()
  description: string;

  @ApiProperty()
  @Expose()
  content: string;

  @ApiProperty()
  @Expose()
  metaTitle: string;

  @ApiProperty()
  @Expose()
  metaDescription: string;

  @ApiProperty()
  @Expose()
  metaKeywords: string;

  @ApiProperty()
  @Expose()
  ogImage: string;

  @ApiProperty()
  @Expose()
  ogTitle: string;

  @ApiProperty()
  @Expose()
  ogDescription: string;

  @ApiProperty()
  @Expose()
  canonicalUrl: string;

  @ApiProperty()
  @Expose()
  structuredData: object;

  @Exclude()
  pageType: PageType;

  @Exclude()
  status: DefaultStatus;

  @Exclude()
  settingId: string;

  @Exclude()
  createdBy: string;

  @Exclude()
  updatedBy: string;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;

  @Exclude()
  deletedAt: Date;
}
