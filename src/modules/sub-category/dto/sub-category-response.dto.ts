/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { Expose, Type, Transform } from 'class-transformer';
import { BaseResponseDto } from '../../../shared/dto/base-response.dto';

export class SubCategoryResponseDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  desc: string;

  @Expose()
  image: string;

  @Expose()
  status: string;

  @Expose()
  settingId: string;

  @Expose()
  categoryId: string;

  @Expose()
  @Transform(({ value }) =>
    value ? new Date(value as string | number | Date).toISOString() : null,
  )
  createdAt: Date;

  @Expose()
  @Transform(({ value }) =>
    value ? new Date(value as string | number | Date).toISOString() : null,
  )
  updatedAt: Date;
}

export class SubCategoryListResponseDto extends BaseResponseDto {
  @Expose()
  @Type(() => SubCategoryResponseDto)
  data: SubCategoryResponseDto[];
}