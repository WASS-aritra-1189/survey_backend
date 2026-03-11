/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import {
  IsBoolean,
  IsEnum,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  IsUrl,
  Length,
  Max,
  Min,
} from 'class-validator';
import { BaseDto } from '../../../shared/dto/base.dto';
import { PartnerCommissionType } from '../../../shared/enums/partner-commission-type.enum';
import { DefaultStatus } from '../../../shared/enums/status.enum';

export class CreateSettingDto extends BaseDto {
  @IsString({ message: 'Title must be a string' })
  @IsNotEmpty({ message: 'Title is required' })
  @Length(1, 100, { message: 'Title must be between 1 and 100 characters' })
  title: string;

  @IsString({ message: 'Message must be a string' })
  @IsNotEmpty({ message: 'Message is required' })
  message: string;

  @IsObject({ message: 'User setting must be a valid JSON object' })
  userSetting: object;

  @IsObject({ message: 'Admin setting must be a valid JSON object' })
  adminSetting: object;

  @IsObject({ message: 'Mobile setting must be a valid JSON object' })
  mobileSetting: object;

  @IsString({ message: 'User domain must be a string' })
  @IsNotEmpty({ message: 'User domain is required' })
  @IsUrl({}, { message: 'User domain must be a valid URL' })
  userDomain: string;

  @IsString({ message: 'Admin domain must be a string' })
  @IsNotEmpty({ message: 'Admin domain is required' })
  @IsUrl({}, { message: 'Admin domain must be a valid URL' })
  adminDomain: string;

  @IsString({ message: 'Mobile domain must be a string' })
  @IsNotEmpty({ message: 'Mobile domain is required' })
  @IsUrl({}, { message: 'Mobile domain must be a valid URL' })
  mobileDomain: string;

  @IsBoolean({ message: 'User maintenance mode must be a boolean' })
  @IsOptional()
  userMaintenanceMode?: boolean;

  @IsBoolean({ message: 'Admin maintenance mode must be a boolean' })
  @IsOptional()
  adminMaintenanceMode?: boolean;

  @IsBoolean({ message: 'Mobile maintenance mode must be a boolean' })
  @IsOptional()
  mobileMaintenanceMode?: boolean;

  @IsString({ message: 'User login logo must be a string' })
  @IsOptional()
  @IsUrl({}, { message: 'User login logo must be a valid URL' })
  userLoginLogo?: string;

  @IsString({ message: 'Admin login logo must be a string' })
  @IsOptional()
  @IsUrl({}, { message: 'Admin login logo must be a valid URL' })
  adminLoginLogo?: string;

  @IsString({ message: 'Mobile login logo must be a string' })
  @IsOptional()
  @IsUrl({}, { message: 'Mobile login logo must be a valid URL' })
  mobileLoginLogo?: string;

  @IsString({ message: 'User register logo must be a string' })
  @IsOptional()
  @IsUrl({}, { message: 'User register logo must be a valid URL' })
  userRegisterLogo?: string;

  @IsString({ message: 'Admin register logo must be a string' })
  @IsOptional()
  @IsUrl({}, { message: 'Admin register logo must be a valid URL' })
  adminRegisterLogo?: string;

  @IsString({ message: 'Mobile register logo must be a string' })
  @IsOptional()
  @IsUrl({}, { message: 'Mobile register logo must be a valid URL' })
  mobileRegisterLogo?: string;

  @IsString({ message: 'User login background must be a string' })
  @IsOptional()
  @IsUrl({}, { message: 'User login background must be a valid URL' })
  userLoginBackground?: string;

  @IsString({ message: 'Admin login background must be a string' })
  @IsOptional()
  @IsUrl({}, { message: 'Admin login background must be a valid URL' })
  adminLoginBackground?: string;

  @IsString({ message: 'Mobile login background must be a string' })
  @IsOptional()
  @IsUrl({}, { message: 'Mobile login background must be a valid URL' })
  mobileLoginBackground?: string;

  @IsString({ message: 'User register background must be a string' })
  @IsOptional()
  @IsUrl({}, { message: 'User register background must be a valid URL' })
  userRegisterBackground?: string;

  @IsString({ message: 'Admin register background must be a string' })
  @IsOptional()
  @IsUrl({}, { message: 'Admin register background must be a valid URL' })
  adminRegisterBackground?: string;

  @IsString({ message: 'Mobile register background must be a string' })
  @IsOptional()
  @IsUrl({}, { message: 'Mobile register background must be a valid URL' })
  mobileRegisterBackground?: string;

  @IsNumber({}, { message: 'Account level must be a number' })
  @IsOptional()
  @Min(1, { message: 'Account level must be at least 1' })
  @Max(10, { message: 'Account level must not exceed 10' })
  accountLevel?: number;

  @IsBoolean({ message: 'Multi device login must be a boolean' })
  @IsOptional()
  multiDeviceLogin?: boolean;

  @IsString({ message: 'Currency must be a string' })
  @IsOptional()
  @Length(3, 3, { message: 'Currency must be exactly 3 characters' })
  @IsIn(['INR', 'USD', 'EUR', 'GBP'], {
    message: 'Currency must be one of: INR, USD, EUR, GBP',
  })
  currency?: string;

  @IsEnum(PartnerCommissionType, {
    message: 'Partner commission type must be a valid enum value',
  })
  partnerCommissionType: PartnerCommissionType;

  @IsEnum(DefaultStatus, { message: 'Status must be a valid enum value' })
  @IsOptional()
  status?: DefaultStatus;
}
