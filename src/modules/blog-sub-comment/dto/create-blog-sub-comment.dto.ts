/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID, MaxLength } from 'class-validator';
import { BaseDto } from '../../../shared/dto/base.dto';

export class CreateBlogSubCommentDto extends BaseDto {
  @ApiProperty({ description: 'Sub-comment content' })
  @IsString()
  @MaxLength(2000)
  content: string;

  @ApiProperty({ description: 'Blog ID' })
  @IsUUID()
  blogId: string;

  @ApiProperty({ description: 'Parent comment ID' })
  @IsUUID()
  blogCommentId: string;

  @ApiProperty({ description: 'Account ID' })
  @IsUUID()
  accountId: string;
}
