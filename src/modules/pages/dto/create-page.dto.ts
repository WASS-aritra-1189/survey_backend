/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';
import { PageType } from '../../../shared/enums/page.enum';
import { DefaultStatus } from '../../../shared/enums/status.enum';

export class CreatePageDto {
  @ApiProperty({ description: 'Page title', maxLength: 200 })
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  title: string;

  @ApiProperty({ enum: PageType, description: 'Type of page' })
  @IsEnum(PageType)
  pageType: PageType;

  @ApiPropertyOptional({ description: 'Page description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Page content' })
  @IsString()
  content: string;

  @ApiPropertyOptional({ description: 'Meta title for SEO', maxLength: 255 })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  metaTitle?: string;

  @ApiPropertyOptional({ description: 'Meta description for SEO' })
  @IsOptional()
  @IsString()
  metaDescription?: string;

  @ApiPropertyOptional({ description: 'Meta keywords for SEO' })
  @IsOptional()
  @IsString()
  metaKeywords?: string;

  @ApiPropertyOptional({ description: 'Open Graph image URL', maxLength: 500 })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  ogImage?: string;

  @ApiPropertyOptional({ description: 'Open Graph title', maxLength: 255 })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  ogTitle?: string;

  @ApiPropertyOptional({ description: 'Open Graph description' })
  @IsOptional()
  @IsString()
  ogDescription?: string;

  @ApiPropertyOptional({ description: 'Canonical URL', maxLength: 500 })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  canonicalUrl?: string;

  @ApiPropertyOptional({ description: 'Structured data for SEO' })
  @IsOptional()
  @IsObject()
  structuredData?: object;

  @ApiPropertyOptional({
    enum: DefaultStatus,
    description: 'Page status',
    default: DefaultStatus.PENDING,
  })
  @IsOptional()
  @IsEnum(DefaultStatus)
  status?: DefaultStatus;

  @ApiProperty({ description: 'Setting ID' })
  @IsUUID()
  settingId: string;

  @ApiPropertyOptional({
    description: 'Created by user ID (auto-filled)',
  })
  @IsOptional()
  @IsUUID()
  createdBy?: string;

  @ApiPropertyOptional({
    description: 'Updated by user ID (auto-filled)',
  })
  @IsOptional()
  @IsUUID()
  updatedBy?: string;
}
