/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  MaxLength,
} from 'class-validator';
import { BaseDto } from '../../../shared/dto/base.dto';
import {
  AccountStatus,
  BankName,
  BankType,
} from '../../../shared/enums/bank.enum';

export class CreateBankDetailDto extends BaseDto {
  @ApiProperty({ description: 'Account holder name', maxLength: 100 })
  @IsString()
  @MaxLength(100)
  accountHolderName: string;

  @ApiProperty({ description: 'Account number', maxLength: 20 })
  @IsString()
  @Length(8, 20)
  accountNumber: string;

  @ApiProperty({ description: 'Confirm account number', maxLength: 20 })
  @IsString()
  @Length(8, 20)
  confirmAccountNumber: string;

  @ApiProperty({ description: 'IFSC code', maxLength: 11 })
  @IsString()
  @Length(11, 11)
  ifscCode: string;

  @ApiProperty({ enum: BankName, description: 'Bank name' })
  @IsEnum(BankName)
  bankName: BankName;

  @ApiProperty({ description: 'Branch name', maxLength: 100 })
  @IsString()
  @MaxLength(100)
  branchName: string;

  @ApiPropertyOptional({ description: 'Branch address' })
  @IsOptional()
  @IsString()
  branchAddress?: string;

  @ApiPropertyOptional({ enum: BankType, default: BankType.SAVINGS })
  @IsOptional()
  @IsEnum(BankType)
  accountType?: BankType = BankType.SAVINGS;

  @ApiPropertyOptional({ enum: AccountStatus, default: AccountStatus.ACTIVE })
  @IsOptional()
  @IsEnum(AccountStatus)
  accountStatus?: AccountStatus = AccountStatus.ACTIVE;

  @ApiPropertyOptional({ description: 'Is default account', default: false })
  @IsOptional()
  @IsBoolean()
  isDefault?: boolean = false;

  @ApiPropertyOptional({ description: 'Swift code', maxLength: 11 })
  @IsOptional()
  @IsString()
  @MaxLength(11)
  swiftCode?: string;

  @ApiPropertyOptional({ description: 'UPI ID', maxLength: 50 })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  upiId?: string;

  @ApiProperty({ description: 'Account ID' })
  @IsUUID()
  accountId: string;
}
