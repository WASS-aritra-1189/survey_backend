/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose,Type,Transform } from 'class-transformer';

export abstract class BaseResponseDto {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  @Transform(({ value }) =>
    value ? new Date(value as string | number | Date).toISOString() : null,
  )
  createdAt: Date;

  @ApiProperty()
  @Expose()
  @Transform(({ value }) =>
    value ? new Date(value as string | number | Date).toISOString() : null,
  )
  updatedAt: Date;

  @Exclude()
  createdBy: string;

  @Exclude()
  updatedBy: string;
}

export class PaginatedResponseDto<T> {
  @ApiProperty()
  @Expose()
  data: T[];

  @ApiProperty()
  @Expose()
  total: number;

  @ApiProperty()
  @Expose()
  page: number;

  @ApiProperty()
  @Expose()
  limit: number;
}

export class EmptyResponseDto {
  @Exclude()
  @ApiProperty({ example: {} })
  @Expose()
  @Type(() => Object)
  data: Record<string, never>;
}
