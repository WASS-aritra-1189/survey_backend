/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
} from 'class-validator';
import { BaseDto } from '../../../shared/dto/base.dto';
import { DefaultStatus } from '../../../shared/enums/status.enum';

export class CreateBlogDto extends BaseDto {
  @ApiProperty({ description: 'Blog title', maxLength: 255 })
  @IsString()
  @MaxLength(255)
  title: string;

  @ApiProperty({ description: 'Blog slug', maxLength: 500 })
  @IsString()
  @MaxLength(500)
  slug: string;

  @ApiPropertyOptional({ description: 'Blog excerpt' })
  @IsOptional()
  @IsString()
  excerpt?: string;

  @ApiProperty({ description: 'Blog content' })
  @IsString()
  content: string;

  @ApiPropertyOptional({ description: 'Featured image URL', maxLength: 500 })
  @IsOptional()
  @IsUrl()
  @MaxLength(500)
  featuredImage?: string;

  @ApiPropertyOptional({ description: 'Meta title', maxLength: 255 })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  metaTitle?: string;

  @ApiPropertyOptional({ description: 'Meta description' })
  @IsOptional()
  @IsString()
  metaDescription?: string;

  @ApiPropertyOptional({ description: 'Blog tags', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiPropertyOptional({ description: 'Published date', example: '2025-01-01T00:00:00.000Z' })
  @IsOptional()
  @IsDateString()
  publishedAt?: string;
}
