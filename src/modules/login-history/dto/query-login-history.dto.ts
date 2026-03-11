/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsArray, IsEnum, IsOptional } from 'class-validator';
import { QueryBaseDto } from '../../../shared/dto/query-base.dto';
import { DeviceType, LogType } from '../../../shared/enums/login.enum';

export class QueryLoginHistoryDto extends QueryBaseDto {
  @ApiPropertyOptional({
    enum: LogType,
    isArray: true,
    description: 'Filter by login type array',
  })
  @IsOptional()
  @IsArray()
  @IsEnum(LogType, { each: true })
  @Transform(({ value }): LogType[] => (Array.isArray(value) ? value : [value]))
  logType?: LogType[];

  @ApiPropertyOptional({
    enum: DeviceType,
    isArray: true,
    description: 'Filter by device type array',
  })
  @IsOptional()
  @IsArray()
  @IsEnum(DeviceType, { each: true })
  @Transform(({ value }): DeviceType[] =>
    Array.isArray(value) ? value : [value],
  )
  deviceType?: DeviceType[];
}
