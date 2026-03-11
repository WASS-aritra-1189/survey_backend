/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID, MaxLength } from 'class-validator';
import { BaseDto } from '../../../shared/dto/base.dto';

export class CreateBlogCommentDto extends BaseDto {
  @ApiProperty({ description: 'Comment text' })
  @IsString()
  @MaxLength(2000)
  comment: string;

  @ApiProperty({ description: 'Blog ID' })
  @IsUUID()
  blogId: string;

  @ApiProperty({ description: 'Account ID' })
  @IsUUID()
  accountId: string;
}
