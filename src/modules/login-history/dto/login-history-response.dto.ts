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
import { DeviceType, LogType } from '../../../shared/enums/login.enum';

export class LoginHistoryResponseDto extends BaseResponseDto {
  @ApiProperty({ enum: LogType })
  @Expose()
  logType: LogType;

  @ApiProperty()
  @Expose()
  ipAddress: string;

  @ApiProperty({ nullable: true })
  @Expose()
  userAgent?: string;

  @ApiProperty({ nullable: true })
  @Expose()
  address?: string;

  @ApiProperty({ enum: DeviceType })
  @Expose()
  deviceType: DeviceType;
}

export class LoginHistoryListResponseDto extends PaginatedResponseDto<LoginHistoryResponseDto> {
  @ApiProperty({ type: [LoginHistoryResponseDto] })
  @Expose()
  declare data: LoginHistoryResponseDto[];
}
