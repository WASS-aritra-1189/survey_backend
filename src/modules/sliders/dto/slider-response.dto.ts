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
import {
  SliderPage,
  SliderPosition,
  SliderStatus,
  SliderType,
} from '../../../shared/enums/slider.enum';

export class SliderResponseDto extends BaseResponseDto {
  @ApiProperty()
  @Expose()
  title: string;

  @ApiProperty()
  @Expose()
  description?: string;

  @ApiProperty()
  @Expose()
  imageUrl: string;

  @ApiProperty()
  @Expose()
  buttonText?: string;

  @ApiProperty({ enum: SliderType })
  @Expose()
  type: SliderType;

  @ApiProperty({ enum: SliderPosition })
  @Expose()
  position: SliderPosition;

  @ApiProperty({ enum: SliderPage })
  @Expose()
  page: SliderPage;

  @ApiProperty({ enum: SliderStatus })
  @Expose()
  status: SliderStatus;

  @ApiProperty()
  @Expose()
  sortOrder: number;

  @ApiProperty()
  @Expose()
  startDate?: Date;

  @ApiProperty()
  @Expose()
  endDate?: Date;

  @ApiProperty()
  @Expose()
  startTime?: string;

  @ApiProperty()
  @Expose()
  endTime?: string;

  @ApiProperty()
  @Expose()
  openInNewTab: boolean;

  @ApiProperty()
  @Expose()
  showOnMobile: boolean;

  @ApiProperty()
  @Expose()
  showOnDesktop: boolean;

  @ApiProperty()
  @Expose()
  settingId: string;
}

export class SliderListResponseDto extends PaginatedResponseDto<SliderResponseDto> {
  @ApiProperty({ type: [SliderResponseDto] })
  @Expose()
  declare data: SliderResponseDto[];
}
