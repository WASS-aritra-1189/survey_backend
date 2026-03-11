/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString, IsUUID, Min } from 'class-validator';
import { BaseDto } from '../../../shared/dto/base.dto';
import { Currency } from '../../../shared/enums/currency.enum';
import { PaymentGateway } from '../../../shared/enums/payment-gateway.enum';
import { PaymentMethod } from '../../../shared/enums/payment-method.enum';
import { PaymentMode } from '../../../shared/enums/payment-mode.enum';
import { PaymentStatus } from '../../../shared/enums/payment-status.enum';
import { PaymentType } from '../../../shared/enums/payment-type.enum';

export class CreatePaymentHistoryDto extends BaseDto {
  @ApiProperty({ description: 'Payment amount', minimum: 0 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  amount: number;

  @ApiPropertyOptional({ description: 'Currency', enum: Currency, default: Currency.INR })
  @IsOptional()
  @IsEnum(Currency)
  currency?: Currency;

  @ApiProperty({ description: 'Payment type', enum: PaymentType })
  @IsEnum(PaymentType)
  paymentType: PaymentType;

  @ApiProperty({ description: 'Payment method', enum: PaymentMethod })
  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;

  @ApiPropertyOptional({ description: 'Payment mode', enum: PaymentMode, default: PaymentMode.ONLINE })
  @IsOptional()
  @IsEnum(PaymentMode)
  paymentMode?: PaymentMode;

  @ApiPropertyOptional({ description: 'Payment status', enum: PaymentStatus, default: PaymentStatus.PENDING })
  @IsOptional()
  @IsEnum(PaymentStatus)
  paymentStatus?: PaymentStatus;

  @ApiPropertyOptional({ description: 'Transaction ID' })
  @IsOptional()
  @IsString()
  transactionId?: string;

  @ApiPropertyOptional({ description: 'Gateway name', enum: PaymentGateway })
  @IsOptional()
  @IsEnum(PaymentGateway)
  gatewayName?: PaymentGateway;

  @ApiPropertyOptional({ description: 'Payment description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Payment remarks' })
  @IsOptional()
  @IsString()
  remarks?: string;

  @ApiPropertyOptional({ description: 'Gateway fees', minimum: 0 })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  fees?: number;

  @ApiPropertyOptional({ description: 'Tax amount', minimum: 0 })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  tax?: number;

  @ApiProperty({ description: 'Net amount after fees and tax', minimum: 0 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  netAmount: number;

  @ApiPropertyOptional({ description: 'Reference number' })
  @IsOptional()
  @IsString()
  referenceNumber?: string;

  @ApiPropertyOptional({ description: 'Bank detail ID' })
  @IsOptional()
  @IsUUID()
  bankDetailId?: string;

  @ApiProperty({ description: 'Account ID' })
  @IsUUID()
  accountId: string;

  @ApiPropertyOptional({ description: 'From account ID for transfers' })
  @IsOptional()
  @IsUUID()
  fromAccountId?: string;

  @ApiPropertyOptional({ description: 'To account ID for transfers' })
  @IsOptional()
  @IsUUID()
  toAccountId?: string;
}
