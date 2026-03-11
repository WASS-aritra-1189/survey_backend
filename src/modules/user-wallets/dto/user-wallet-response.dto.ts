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
import { Currency } from '../../../shared/enums/currency.enum';
import { DefaultStatus } from '../../../shared/enums/status.enum';
import { TransactionType } from '../../../shared/enums/transaction-type.enum';

export class UserWalletResponseDto extends BaseResponseDto {
  @ApiProperty()
  @Expose()
  amount: number;

  @ApiProperty({ enum: TransactionType })
  @Expose()
  transactionType: TransactionType;

  @ApiProperty({ enum: Currency })
  @Expose()
  currency: Currency;

  @ApiProperty()
  @Expose()
  description: string;

  @ApiProperty()
  @Expose()
  referenceId: string;

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

export class UserWalletListResponseDto extends PaginatedResponseDto<UserWalletResponseDto> {
  @ApiProperty({ type: [UserWalletResponseDto] })
  @Expose()
  @Type(() => UserWalletResponseDto)
  declare data: UserWalletResponseDto[];
}

export class BalanceResponseDto {
  @ApiProperty()
  @Expose()
  balance: number;

  @ApiProperty()
  @Expose()
  currency: string;
}
