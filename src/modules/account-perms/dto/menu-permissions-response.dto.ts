/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { DefaultStatus } from '../../../shared/enums/status.enum';

export class PermissionDto {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  status: boolean;
}

export class MenuPermissionsDto {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  status: DefaultStatus;

  @ApiProperty({ type: [PermissionDto] })
  @Expose()
  @Type(() => PermissionDto)
  permissions: PermissionDto[];
}

export class MenuPermissionsResponseDto {
  @ApiProperty({ type: [MenuPermissionsDto] })
  @Expose()
  @Type(() => MenuPermissionsDto)
  menu: MenuPermissionsDto[];
}
