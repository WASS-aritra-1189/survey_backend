/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import {
  BaseResponseDto,
  PaginatedResponseDto,
} from '../../../shared/dto/base-response.dto';
import { UserRoles } from '../../../shared/enums/accouts.enum';
import { UserStatus } from '../../../shared/enums/status.enum';
import { IsOptional } from 'class-validator';

export class AccountResponseDto extends BaseResponseDto {
  @ApiProperty()
  @Expose()
  loginId: string;

  @ApiProperty({ enum: UserRoles })
  @Expose()
  roles: UserRoles;

  @ApiProperty({ enum: UserStatus })
  @Expose()
  status: UserStatus;

  @ApiProperty()
  @Expose()
  accountLevelId: string;

  @ApiProperty()
  @Expose()
  @IsOptional()
  settingId: string;

  @ApiProperty()
  @Expose()
  password: string;

  @ApiProperty()
  @Expose()
  deviceId:string;
}


export class AccountListResponseDto extends PaginatedResponseDto<AccountResponseDto> {
  @ApiProperty({ type: [AccountResponseDto] })
  @Expose()
  declare data: AccountResponseDto[];
}
