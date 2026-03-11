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

export class DesignationResponseDto extends BaseResponseDto {
  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  description?: string;

  @ApiProperty()
  @Expose()
  priority: number;

  @ApiProperty({ enum: DefaultStatus })
  @Expose()
  status: DefaultStatus;

  @ApiProperty()
  @Expose()
  settingId: string;
}

export class DesignationListResponseDto extends PaginatedResponseDto<DesignationResponseDto> {
  @ApiProperty({ type: [DesignationResponseDto] })
  @Expose()
  declare data: DesignationResponseDto[];
}
