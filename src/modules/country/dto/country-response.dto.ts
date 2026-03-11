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

export class CountryResponseDto extends BaseResponseDto {
  @Expose()
  name: string;

  @Expose()
  code: string;

  @Expose()
  flag: string;

  @Expose()
  status: DefaultStatus;
}

export class CountryListResponseDto extends PaginatedResponseDto<CountryResponseDto> {
  @ApiProperty({ type: [CountryResponseDto] })
  @Expose()
  declare data: CountryResponseDto[];
}
