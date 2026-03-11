/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import {
  BaseResponseDto,
  PaginatedResponseDto,
} from '../../../shared/dto/base-response.dto';
import { Gender } from '../../../shared/enums/gender.enum';

export class UserDetailResponseDto extends BaseResponseDto {
  @ApiProperty()
  @Expose()
  firstName: string;

  @ApiProperty()
  @Expose()
  middleName: string;

  @ApiProperty()
  @Expose()
  lastName: string;

  @ApiProperty()
  @Expose()
  email: string;

  @ApiPropertyOptional()
  @Expose()
  phone?: string;

  @ApiPropertyOptional()
  @Expose()
  dateOfBirth?: Date;

  @ApiPropertyOptional({ enum: Gender })
  @Expose()
  gender?: Gender;

  @ApiPropertyOptional()
  @Expose()
  profilePicture?: string;

  @ApiProperty()
  @Expose()
  isActive: boolean;

  @ApiProperty()
  @Expose()
  isVerified: boolean;

  @ApiProperty()
  @Expose()
  accountId: string;
}

export class UserDetailDto extends BaseResponseDto {
  @ApiProperty()
  @Expose()
  firstName: string;

  @ApiProperty()
  @Expose()
  middleName: string;

  @ApiProperty()
  @Expose()
  lastName: string;

  @ApiProperty()
  @Expose()
  email: string;

  @ApiPropertyOptional()
  @Expose()
  phone?: string;

  @ApiPropertyOptional()
  @Expose()
  dateOfBirth?: Date;

  @ApiPropertyOptional({ enum: Gender })
  @Expose()
  gender?: Gender;

  @ApiPropertyOptional()
  @Expose()
  profilePicture?: string;

  @ApiProperty()
  @Expose()
  isActive: boolean;

  @ApiProperty()
  @Expose()
  isVerified: boolean;

  @ApiProperty()
  @Expose()
  accountId: string;
}

export class UserListResponseDto extends PaginatedResponseDto<UserDetailDto> {
  @ApiProperty({ type: [UserDetailDto] })
  @Expose()
  declare data: UserDetailDto[];
}
