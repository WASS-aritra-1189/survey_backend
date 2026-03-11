/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { BaseDto } from '../../../shared/dto/base.dto';
import {
  EmailFrequency,
  NewsletterCategory,
} from '../../../shared/enums/newsletter.enum';

export class CreateNewsLetterDto extends BaseDto {
  @ApiProperty({ description: 'Newsletter title' })
  @IsString()
  @MaxLength(200)
  title: string;

  @ApiProperty({ description: 'Newsletter description' })
  @IsString()
  description: string;

  @ApiProperty({ enum: NewsletterCategory })
  @IsEnum(NewsletterCategory)
  category: NewsletterCategory;

  @ApiProperty({ enum: EmailFrequency })
  @IsEnum(EmailFrequency)
  frequency: EmailFrequency;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  template?: string;
}
