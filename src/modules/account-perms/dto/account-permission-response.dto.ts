/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { BaseResponseDto, PaginatedResponseDto } from '../../../shared/dto/base-response.dto';

export class AccountPermissionResponseDto extends BaseResponseDto {
  @ApiProperty()
  @Expose()
  accountId: string;

  @ApiProperty()
  @Expose()
  menuId: string;

  @ApiProperty()
  @Expose()
  permissionId: string;
}

export class AccountPermissionDto extends BaseResponseDto {
  @ApiProperty()
  @Expose()
  accountId: string;

  @ApiProperty()
  @Expose()
  menuId: string;

  @ApiProperty()
  @Expose()
  permissionId: string;
}

export class AccountPermissionListResponseDto extends PaginatedResponseDto<AccountPermissionDto> {
  @ApiProperty({ type: [AccountPermissionDto] })
  @Expose()
  @Type(() => AccountPermissionDto)
  declare data: AccountPermissionDto[];
}