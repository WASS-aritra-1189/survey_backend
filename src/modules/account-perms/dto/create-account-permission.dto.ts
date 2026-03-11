/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsUUID } from 'class-validator';

export class CreateAccountPermissionDto {
  @ApiProperty({ description: 'ID'})
  
  @IsUUID()
  id?: string;

  @ApiProperty({ description: 'Account ID' })
  @IsUUID()
  accountId: string;

  @ApiProperty({ description: 'Menu ID' })
  @IsUUID()
  menuId: string;

  @ApiProperty({ description: 'Permission ID' })
  @IsUUID()
  permissionId: string;

  @ApiProperty({ description: 'Permission status', default: true })
  @IsOptional()
  @IsBoolean()
  status?: boolean;

  createdBy?: string;
  updatedBy?: string;
}
