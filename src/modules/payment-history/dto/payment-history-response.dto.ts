/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { BaseResponseDto, PaginatedResponseDto } from '../../../shared/dto/base-response.dto';
import { Currency } from '../../../shared/enums/currency.enum';
import { PaymentGateway } from '../../../shared/enums/payment-gateway.enum';
import { PaymentMethod } from '../../../shared/enums/payment-method.enum';
import { PaymentMode } from '../../../shared/enums/payment-mode.enum';
import { PaymentStatus } from '../../../shared/enums/payment-status.enum';
import { PaymentType } from '../../../shared/enums/payment-type.enum';
import { DefaultStatus } from '../../../shared/enums/status.enum';

export class PaymentHistoryResponseDto extends BaseResponseDto {
  @ApiProperty()
  @Expose()
  amount: number;

  @ApiProperty({ enum: Currency })
  @Expose()
  currency: Currency;

  @ApiProperty({ enum: PaymentType })
  @Expose()
  paymentType: PaymentType;

  @ApiProperty({ enum: PaymentMethod })
  @Expose()
  paymentMethod: PaymentMethod;

  @ApiProperty({ enum: PaymentMode })
  @Expose()
  paymentMode: PaymentMode;

  @ApiProperty({ enum: PaymentStatus })
  @Expose()
  paymentStatus: PaymentStatus;

  @ApiProperty()
  @Expose()
  transactionId: string;

  @ApiProperty({ enum: PaymentGateway })
  @Expose()
  gatewayName: PaymentGateway;

  @ApiProperty()
  @Expose()
  description: string;

  @ApiProperty()
  @Expose()
  netAmount: number;

  @ApiProperty()
  @Expose()
  referenceNumber: string;

  @ApiProperty({ enum: DefaultStatus })
  @Expose()
  status: DefaultStatus;

  @ApiProperty()
  @Expose()
  accountId: string;

  @ApiProperty()
  @Expose()
  fromAccountId: string;

  @ApiProperty()
  @Expose()
  toAccountId: string;

  @ApiProperty()
  @Expose()
  settingId: string;
}

export class PaymentHistoryListResponseDto extends PaginatedResponseDto<PaymentHistoryResponseDto> {
  @ApiProperty({ type: [PaymentHistoryResponseDto] })
  @Expose()
  @Type(() => PaymentHistoryResponseDto)
  declare data: PaymentHistoryResponseDto[];
}