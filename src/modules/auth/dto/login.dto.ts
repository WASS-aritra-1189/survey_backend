/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { RoleDto } from '../../../shared/dto/role.dto';

export class LoginWithPasswordDto extends RoleDto {
  @ApiProperty({ description: 'User login ID', example: 'user123' })
  @IsString()
  @IsNotEmpty()
  loginId: string;

  @ApiProperty({ description: 'User password', example: 'password123' })
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class LoginWithOTPDto extends RoleDto {
  @ApiProperty({
    description: 'User login ID or phone number',
    example: 'user123',
  })
  @IsString()
  @IsNotEmpty()
  loginId: string;
}

export class VerifyOTPDto extends RoleDto {
  @ApiProperty({ description: 'User login ID', example: 'user123' })
  @IsString()
  @IsNotEmpty()
  loginId: string;

  @ApiProperty({ description: 'OTP code', example: '123456' })
  @IsString()
  @IsNotEmpty()
  otp: string;
}

export class LoginWithFacebookDto extends RoleDto {
  @ApiProperty({
    description: 'Facebook access token',
    example: 'EAABwzLixnjYBO...',
  })
  @IsString()
  @IsNotEmpty()
  accessToken: string;

  @ApiPropertyOptional({
    description: 'User name from Facebook',
    example: 'John Doe',
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({
    description: 'User email from Facebook',
    example: 'john@example.com',
  })
  @IsString()
  @IsOptional()
  email?: string;
}

export class LoginWithGoogleDto extends RoleDto {
  @ApiProperty({
    description: 'Google ID token',
    example: 'eyJhbGciOiJSUzI1NiIs...',
  })
  @IsString()
  @IsNotEmpty()
  idToken: string;

  @ApiPropertyOptional({
    description: 'User name from Google',
    example: 'John Doe',
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({
    description: 'User email from Google',
    example: 'john@example.com',
  })
  @IsString()
  @IsOptional()
  email?: string;
}
