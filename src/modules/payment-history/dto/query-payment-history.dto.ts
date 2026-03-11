/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsUUID } from 'class-validator';
import { QueryBaseDto } from '../../../shared/dto/query-base.dto';
import { Currency } from '../../../shared/enums/currency.enum';
import { PaymentGateway } from '../../../shared/enums/payment-gateway.enum';
import { PaymentMethod } from '../../../shared/enums/payment-method.enum';
import { PaymentMode } from '../../../shared/enums/payment-mode.enum';
import { PaymentStatus } from '../../../shared/enums/payment-status.enum';
import { PaymentType } from '../../../shared/enums/payment-type.enum';

export class QueryPaymentHistoryDto extends QueryBaseDto {
  @ApiPropertyOptional({
    description: 'Filter by payment type',
    enum: PaymentType,
  })
  @IsOptional()
  @IsEnum(PaymentType)
  paymentType?: PaymentType;

  @ApiPropertyOptional({
    description: 'Filter by payment method',
    enum: PaymentMethod,
  })
  @IsOptional()
  @IsEnum(PaymentMethod)
  paymentMethod?: PaymentMethod;

  @ApiPropertyOptional({
    description: 'Filter by payment mode',
    enum: PaymentMode,
  })
  @IsOptional()
  @IsEnum(PaymentMode)
  paymentMode?: PaymentMode;

  @ApiPropertyOptional({
    description: 'Filter by payment status',
    enum: PaymentStatus,
  })
  @IsOptional()
  @IsEnum(PaymentStatus)
  paymentStatus?: PaymentStatus;

  @ApiPropertyOptional({ description: 'Filter by currency', enum: Currency })
  @IsOptional()
  @IsEnum(Currency)
  currency?: Currency;

  @ApiPropertyOptional({
    description: 'Filter by gateway',
    enum: PaymentGateway,
  })
  @IsOptional()
  @IsEnum(PaymentGateway)
  gatewayName?: PaymentGateway;

  @ApiPropertyOptional({ description: 'Filter by from account ID' })
  @IsOptional()
  @IsUUID()
  fromAccountId?: string;

  @ApiPropertyOptional({ description: 'Filter by to account ID' })
  @IsOptional()
  @IsUUID()
  toAccountId?: string;
}
