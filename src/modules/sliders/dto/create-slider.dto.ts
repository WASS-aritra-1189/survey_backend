/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  Min,
} from 'class-validator';
import { BaseDto } from '../../../shared/dto/base.dto';
import {
  RedirectType,
  SliderPage,
  SliderPosition,
  SliderStatus,
  SliderType,
} from '../../../shared/enums/slider.enum';

export class CreateSliderDto extends BaseDto {
  @ApiProperty({ description: 'Slider title', maxLength: 200 })
  @IsString()
  @MaxLength(200)
  title: string;

  @ApiPropertyOptional({ description: 'Slider description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Image URL', maxLength: 500 })
  @IsUrl()
  @MaxLength(500)
  imageUrl: string;

  @ApiProperty({ description: 'Redirect URL', maxLength: 500 })
  @IsOptional()
  @MaxLength(500)
  redirectUrl: string;

  @ApiPropertyOptional({ description: 'Button text', maxLength: 100 })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  buttonText?: string;

  @ApiPropertyOptional({ enum: SliderType, default: SliderType.BANNER })
  @IsOptional()
  @IsEnum(SliderType)
  type?: SliderType = SliderType.BANNER;

  @ApiPropertyOptional({ enum: SliderPosition, default: SliderPosition.TOP })
  @IsOptional()
  @IsEnum(SliderPosition)
  position?: SliderPosition = SliderPosition.TOP;

  @ApiPropertyOptional({ enum: SliderPage, default: SliderPage.HOME })
  @IsOptional()
  @IsEnum(SliderPage)
  page?: SliderPage = SliderPage.HOME;

  @ApiPropertyOptional({ enum: RedirectType, default: RedirectType.INTERNAL })
  @IsOptional()
  @IsEnum(RedirectType)
  redirectType?: RedirectType = RedirectType.INTERNAL;

  @ApiPropertyOptional({ enum: SliderStatus, default: SliderStatus.ACTIVE })
  @IsOptional()
  @IsEnum(SliderStatus)
  status?: SliderStatus = SliderStatus.ACTIVE;

  @ApiPropertyOptional({ description: 'Sort order', default: 0, minimum: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number = 0;

  @ApiPropertyOptional({ description: 'Start date (ISO string)' })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({ description: 'End date (ISO string)' })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiPropertyOptional({ description: 'Start time (HH:mm format)' })
  @IsOptional()
  @IsString()
  startTime?: string;

  @ApiPropertyOptional({ description: 'End time (HH:mm format)' })
  @IsOptional()
  @IsString()
  endTime?: string;

  @ApiPropertyOptional({ description: 'Open in new tab', default: false })
  @IsOptional()
  @IsBoolean()
  openInNewTab?: boolean = false;

  @ApiPropertyOptional({ description: 'Show on mobile', default: true })
  @IsOptional()
  @IsBoolean()
  showOnMobile?: boolean = true;

  @ApiPropertyOptional({ description: 'Show on desktop', default: true })
  @IsOptional()
  @IsBoolean()
  showOnDesktop?: boolean = true;
}
