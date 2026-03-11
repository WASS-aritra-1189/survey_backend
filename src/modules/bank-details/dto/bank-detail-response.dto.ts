/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { BaseResponseDto } from '../../../shared/dto/base-response.dto';
import { AccountStatus, BankName, BankType } from '../../../shared/enums/bank.enum';

export class BankDetailResponseDto {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  accountHolderName: string;

  @ApiProperty()
  @Expose()
  accountNumber: string;

  @ApiProperty()
  @Expose()
  ifscCode: string;

  @ApiProperty({ enum: BankName })
  @Expose()
  bankName: BankName;

  @ApiProperty()
  @Expose()
  branchName: string;

  @ApiProperty()
  @Expose()
  branchAddress?: string;

  @ApiProperty({ enum: BankType })
  @Expose()
  accountType: BankType;

  @ApiProperty({ enum: AccountStatus })
  @Expose()
  accountStatus: AccountStatus;

  @ApiProperty()
  @Expose()
  isDefault: boolean;

  @ApiProperty()
  @Expose()
  upiId?: string;

  @ApiProperty()
  @Expose()
  currencyCode: string;

  @ApiProperty()
  @Expose()
  countryCode: string;

  @ApiProperty()
  @Expose()
  accountId: string;

  @ApiProperty()
  @Expose()
  settingId: string;

  @ApiProperty()
  @Expose()
  createdAt: Date;

  @ApiProperty()
  @Expose()
  updatedAt: Date;
}

export class BankDetailListResponseDto extends BaseResponseDto {
  @ApiProperty({ type: [BankDetailResponseDto] })
  @Type(() => BankDetailResponseDto)
  @Expose()
  data: BankDetailResponseDto[];

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