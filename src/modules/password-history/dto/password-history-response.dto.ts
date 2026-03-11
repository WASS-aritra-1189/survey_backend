/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { BaseResponseDto, PaginatedResponseDto } from '../../../shared/dto/base-response.dto';
import { DefaultStatus } from '../../../shared/enums/status.enum';

export class PasswordHistoryResponseDto extends BaseResponseDto {
  @Exclude()
  passwordHash: string;

  @Exclude()
  oldPasswordEncrypted: string;

  @Exclude()
  newPasswordEncrypted: string;

  @Exclude()
  encryptionKey: string;

  @ApiProperty()
  @Expose()
  encryptionAlgorithm: string;

  @Exclude()
  salt: string;

  @ApiProperty()
  @Expose()
  hashAlgorithm: string;

  @ApiProperty()
  @Expose()
  changedAt: Date;

  @ApiProperty()
  @Expose()
  ipAddress: string;

  @ApiProperty()
  @Expose()
  changeReason: string;

  @ApiProperty()
  @Expose()
  isExpired: boolean;

  @ApiProperty()
  @Expose()
  expiresAt: Date;

  @ApiProperty({ enum: DefaultStatus })
  @Expose()
  status: DefaultStatus;

  @ApiProperty()
  @Expose()
  accountId: string;

  @ApiProperty()
  @Expose()
  settingId: string;
}

export class PasswordHistoryListResponseDto extends PaginatedResponseDto<PasswordHistoryResponseDto> {
  @ApiProperty({ type: [PasswordHistoryResponseDto] })
  @Expose()
  @Type(() => PasswordHistoryResponseDto)
  declare data: PasswordHistoryResponseDto[];
}