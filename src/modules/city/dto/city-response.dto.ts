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

export class CityResponseDto extends BaseResponseDto {
  @Expose()
  name: string;

  @Expose()
  code: string;

  @Expose()
  status: string;

  @Expose()
  countryId: string;

  @Expose()
  stateId: string;
}

export class CityListResponseDto extends PaginatedResponseDto<CityResponseDto> {
  @ApiProperty({ type: [CityResponseDto] })
  @Expose()
  declare data: CityResponseDto[];
}
