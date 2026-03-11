/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import {
  BaseResponseDto,
  PaginatedResponseDto,
} from '../../../shared/dto/base-response.dto';
import { DefaultStatus } from '../../../shared/enums/status.enum';

export class MenuResponseDto extends BaseResponseDto {
  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  title: string;

  @ApiProperty()
  @Expose()
  description: string;

  @ApiProperty({ enum: DefaultStatus })
  @Expose()
  status: DefaultStatus;
}

export class MenuDto extends BaseResponseDto {
  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  title: string;

  @ApiProperty({ enum: DefaultStatus })
  @Expose()
  status: DefaultStatus;
}

export class MenuListResponseDto extends PaginatedResponseDto<MenuDto> {
  @ApiProperty({ type: [MenuDto] })
  @Expose()
  @Type(() => MenuDto)
  declare data: MenuDto[];
}
