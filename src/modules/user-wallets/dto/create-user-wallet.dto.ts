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
import { TransactionType } from '../../../shared/enums/transaction-type.enum';

export class CreateUserWalletDto extends BaseDto {
  @ApiProperty({ description: 'Transaction amount', minimum: 0 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  amount: number;

  @ApiProperty({ description: 'Transaction type', enum: TransactionType })
  @IsEnum(TransactionType)
  transactionType: TransactionType;

  @ApiPropertyOptional({ description: 'Currency', enum: Currency, default: Currency.INR })
  @IsOptional()
  @IsEnum(Currency)
  currency?: Currency;

  @ApiPropertyOptional({ description: 'Transaction description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'External reference ID' })
  @IsOptional()
  @IsString()
  referenceId?: string;

  @ApiProperty({ description: 'Account ID' })
  @IsUUID()
  accountId: string;
}