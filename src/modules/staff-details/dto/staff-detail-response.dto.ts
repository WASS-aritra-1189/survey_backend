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

export class StaffDetailResponseDto extends BaseResponseDto {
  @ApiProperty()
  @Expose()
  firstName: string;

  @ApiPropertyOptional()
  @Expose()
  middleName?: string;

  @ApiProperty()
  @Expose()
  lastName: string;

  @ApiProperty()
  @Expose()
  email: string;

  @ApiProperty()
  @Expose()
  phone: string;

  @ApiPropertyOptional()
  @Expose()
  alternatePhone?: string;

  @ApiPropertyOptional()
  @Expose()
  dateOfBirth?: Date;

  @ApiPropertyOptional({ enum: Gender })
  @Expose()
  gender?: Gender;

  @ApiPropertyOptional()
  @Expose()
  address?: string;

  @ApiPropertyOptional()
  @Expose()
  city?: string;

  @ApiPropertyOptional()
  @Expose()
  state?: string;

  @ApiPropertyOptional()
  @Expose()
  zipCode?: string;

  @ApiPropertyOptional()
  @Expose()
  country?: string;

  @ApiPropertyOptional()
  @Expose()
  profilePicture?: string;

  @ApiPropertyOptional()
  @Expose()
  employeeId?: string;

  @ApiPropertyOptional()
  @Expose()
  joiningDate?: Date;

  @ApiPropertyOptional()
  @Expose()
  salary?: number;

  @ApiPropertyOptional()
  @Expose()
  emergencyContactName?: string;

  @ApiPropertyOptional()
  @Expose()
  emergencyContactPhone?: string;

  @ApiPropertyOptional()
  @Expose()
  emergencyContactRelation?: string;

  @ApiPropertyOptional()
  @Expose()
  idProof1Type?: string;

  @ApiPropertyOptional()
  @Expose()
  idProof1Number?: string;

  @ApiPropertyOptional()
  @Expose()
  idProof1Document?: string;

  @ApiPropertyOptional()
  @Expose()
  idProof2Type?: string;

  @ApiPropertyOptional()
  @Expose()
  idProof2Number?: string;

  @ApiPropertyOptional()
  @Expose()
  idProof2Document?: string;

  @ApiPropertyOptional()
  @Expose()
  addressProofType?: string;

  @ApiPropertyOptional()
  @Expose()
  addressProofNumber?: string;

  @ApiPropertyOptional()
  @Expose()
  addressProofDocument?: string;

  @ApiPropertyOptional()
  @Expose()
  highestEducation?: string;

  @ApiPropertyOptional()
  @Expose()
  educationInstitute?: string;

  @ApiPropertyOptional()
  @Expose()
  educationYear?: string;

  @ApiPropertyOptional()
  @Expose()
  educationCertificate?: string;

  @ApiPropertyOptional({ type: [String] })
  @Expose()
  skills?: string[];

  @ApiPropertyOptional()
  @Expose()
  workExperience?: string;

  @ApiProperty()
  @Expose()
  accountId: string;

  @ApiProperty()
  @Expose()
  designationId: string;
}

export class StaffDetailForListDto extends BaseResponseDto {
  @ApiProperty()
  @Expose()
  firstName: string;

  @ApiPropertyOptional()
  @Expose()
  middleName?: string;

  @ApiProperty()
  @Expose()
  lastName: string;

  @ApiProperty()
  @Expose()
  email: string;

  @ApiProperty()
  @Expose()
  phone: string;

  @ApiPropertyOptional()
  @Expose()
  dateOfBirth?: Date;

  @ApiPropertyOptional({ enum: Gender })
  @Expose()
  gender?: Gender;

  @ApiPropertyOptional()
  @Expose()
  city?: string;

  @ApiPropertyOptional()
  @Expose()
  state?: string;

  @ApiPropertyOptional()
  @Expose()
  zipCode?: string;

  @ApiPropertyOptional()
  @Expose()
  country?: string;

  @ApiPropertyOptional()
  @Expose()
  profilePicture?: string;

  @ApiPropertyOptional()
  @Expose()
  employeeId?: string;

  @ApiPropertyOptional()
  @Expose()
  joiningDate?: Date;

  @ApiPropertyOptional()
  @Expose()
  workExperience?: string;

  @ApiProperty()
  @Expose()
  accountId: string;

  @ApiProperty()
  @Expose()
  designationId: string;
}

export class StaffListResponseDto extends PaginatedResponseDto<StaffDetailForListDto> {
  @ApiProperty({ type: [StaffDetailForListDto] })
  @Expose()
  declare data: StaffDetailForListDto[];
}
