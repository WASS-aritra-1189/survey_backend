/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsIP, IsOptional, IsString, IsUUID } from 'class-validator';
import { DeviceType, LogType } from '../../../shared/enums/login.enum';

export class CreateLoginHistoryDto {
  @ApiProperty({ enum: LogType })
  @IsEnum(LogType)
  logType: LogType;

  @ApiProperty({ description: 'IP address' })
  @IsIP()
  ipAddress: string;

  @ApiPropertyOptional({ description: 'User agent string' })
  @IsOptional()
  @IsString()
  userAgent?: string;

  @ApiPropertyOptional({ description: 'Physical address' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ enum: DeviceType })
  @IsEnum(DeviceType)
  deviceType: DeviceType;

  @ApiProperty({ description: 'Account ID' })
  @IsUUID()
  accountId: string;
}
