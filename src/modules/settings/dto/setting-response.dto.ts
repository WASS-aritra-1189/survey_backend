/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { ApiProperty } from '@nestjs/swagger';
import { Expose,Type } from 'class-transformer';
import { PaginatedResponseDto } from '../../../shared/dto/base-response.dto';
import { PartnerCommissionType } from '../../../shared/enums/partner-commission-type.enum';
import { DefaultStatus } from '../../../shared/enums/status.enum';

export class SettingResponseDto {
  @Expose()
  id: string;

  @Expose()
  title: string;

  @Expose()
  message: string;

  @Expose()
  userSetting: object;

  @Expose()
  adminSetting: object;

  @Expose()
  mobileSetting: object;

  @Expose()
  userDomain: string;

  @Expose()
  adminDomain: string;

  @Expose()
  mobileDomain: string;

  @Expose()
  userMaintenanceMode: boolean;

  @Expose()
  adminMaintenanceMode: boolean;

  @Expose()
  mobileMaintenanceMode: boolean;

  @Expose()
  userLoginLogo: string;

  @Expose()
  adminLoginLogo: string;

  @Expose()
  mobileLoginLogo: string;

  @Expose()
  userRegisterLogo: string;

  @Expose()
  adminRegisterLogo: string;

  @Expose()
  mobileRegisterLogo: string;

  @Expose()
  userLoginBackground: string;

  @Expose()
  adminLoginBackground: string;

  @Expose()
  mobileLoginBackground: string;

  @Expose()
  userRegisterBackground: string;

  @Expose()
  adminRegisterBackground: string;

  @Expose()
  mobileRegisterBackground: string;

  @Expose()
  accountLevel: number;

  @Expose()
  multiDeviceLogin: boolean;

  @Expose()
  currency: string;

  @Expose()
  partnerCommissionType: PartnerCommissionType;

  @Expose()
  status: DefaultStatus;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}

export class SettingIdResponseDto {
  @Expose()
  id: string;
}

export class SettingPaginationItemDto {
  @Expose()
  id: string;

  @Expose()
  title: string;

  @Expose()
  userDomain: string;

  @Expose()
  adminDomain: string;

  @Expose()
  mobileDomain: string;

  @Expose()
  status: DefaultStatus;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}

export class SettingPaginationResponseDto extends PaginatedResponseDto<SettingPaginationItemDto> {
  @ApiProperty({ type: [SettingPaginationItemDto] })
  @Expose()
  @Type(() => SettingPaginationItemDto)

  declare data: SettingPaginationItemDto[];
}
