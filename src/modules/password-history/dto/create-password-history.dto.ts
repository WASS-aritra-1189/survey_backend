/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsDateString, IsOptional, IsString, IsUUID } from 'class-validator';
import { BaseDto } from '../../../shared/dto/base.dto';

export class CreatePasswordHistoryDto extends BaseDto {
  @ApiProperty({ description: 'Password hash' })
  @IsString()
  passwordHash: string;

  @ApiPropertyOptional({ description: 'Old password encrypted' })
  @IsOptional()
  @IsString()
  oldPasswordEncrypted?: string;

  @ApiPropertyOptional({ description: 'New password encrypted' })
  @IsOptional()
  @IsString()
  newPasswordEncrypted?: string;

  @ApiPropertyOptional({ description: 'Encryption key' })
  @IsOptional()
  @IsString()
  encryptionKey?: string;

  @ApiPropertyOptional({ description: 'Encryption algorithm' })
  @IsOptional()
  @IsString()
  encryptionAlgorithm?: string;

  @ApiPropertyOptional({ description: 'Password salt' })
  @IsOptional()
  @IsString()
  salt?: string;

  @ApiPropertyOptional({ description: 'Hash algorithm' })
  @IsOptional()
  @IsString()
  hashAlgorithm?: string;

  @ApiProperty({ description: 'Password change timestamp' })
  @IsDateString()
  changedAt: string;

  @ApiPropertyOptional({ description: 'IP address' })
  @IsOptional()
  @IsString()
  ipAddress?: string;

  @ApiPropertyOptional({ description: 'User agent' })
  @IsOptional()
  @IsString()
  userAgent?: string;

  @ApiPropertyOptional({ description: 'Change reason' })
  @IsOptional()
  @IsString()
  changeReason?: string;

  @ApiPropertyOptional({ description: 'Is expired', default: false })
  @IsOptional()
  @IsBoolean()
  isExpired?: boolean;

  @ApiPropertyOptional({ description: 'Expiration date' })
  @IsOptional()
  @IsDateString()
  expiresAt?: string;

  @ApiProperty({ description: 'Account ID' })
  @IsUUID()
  accountId: string;
}
