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
import { TransactionType } from '../../../shared/enums/transaction-type.enum';

export class QueryUserWalletDto extends QueryBaseDto {
  @ApiPropertyOptional({ description: 'Filter by transaction type', enum: TransactionType })
  @IsOptional()
  @IsEnum(TransactionType)
  transactionType?: TransactionType;

  @ApiPropertyOptional({ description: 'Filter by currency', enum: Currency })
  @IsOptional()
  @IsEnum(Currency)
  currency?: Currency;
}
