/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';
import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Patch,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { CurrentUser } from '../../core/decorators/current-user.decorator';
import { Permissions } from '../../core/decorators/permissions.decorator';
import { ResponseMessage } from '../../core/decorators/response-message.decorator';
import { Roles } from '../../core/decorators/roles.decorator';
import { JwtAuthGuard } from '../../core/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../core/guards/permissions.guard';
import { RolesGuard } from '../../core/guards/roles.guard';
import { Serialize } from '../../core/interceptors/serialize.interceptor';
import type { IUser } from '../../core/interfaces/user.interface';
import { EmptyResponseDto } from '../../shared/dto/base-response.dto';
import { UserRoles } from '../../shared/enums/accouts.enum';
import { PermissionType } from '../../shared/enums/permissions.enum';
import { QueryUserDetailDto } from './dto/query-user-detail.dto';
import { UpdateUserDetailDto } from './dto/update-user-detail.dto';
import {
  UserDetailResponseDto,
  UserListResponseDto,
} from './dto/user-detail-response.dto';
import { UserDetail } from './entities/user-detail.entity';
import { IUserDetailsService } from './interfaces/user-details-service.interface';

@ApiTags('User Details')
@Controller('user-details')
export class UserDetailsController {
  constructor(
    @Inject('IUserDetailsService')
    private readonly userDetailsService: IUserDetailsService,
  ) {}

  @Get()
  @ResponseMessage('DATA_004')
  @Serialize(UserListResponseDto)
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
  @Roles(UserRoles.ROOT, UserRoles.ADMIN, UserRoles.ROOT_STAFF, UserRoles.STAFF)
  @Permissions(PermissionType.READ, 'user_details')
  @UseInterceptors(CacheInterceptor)
  @CacheKey('protected_user_details')
  @CacheTTL(120)
  @Throttle({ default: { limit: 50, ttl: 60000 } })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all user details' })
  @ApiResponse({ type: [UserListResponseDto] })
  findAll(
    @Query() query: QueryUserDetailDto,
    @CurrentUser() user: IUser,
  ): Promise<{
    data: UserDetail[];
    total: number;
    page: number;
    limit: number;
  }> {
    if (user.role !== UserRoles.ROOT && user.role !== UserRoles.ROOT_STAFF) {
      query.settingId = user.settingId;
    }
    return this.userDetailsService.findAll(query);
  }

  @Get(':id')
  @ResponseMessage('DATA_004')
  @Serialize(UserDetailResponseDto)
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
  @Roles(UserRoles.ROOT, UserRoles.ADMIN, UserRoles.ROOT_STAFF, UserRoles.STAFF)
  @Permissions(PermissionType.READ, 'user_details')
  @Throttle({ default: { limit: 30, ttl: 60000 } })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user detail by ID' })
  @ApiResponse({ type: UserDetailResponseDto })
  findOne(@Param('id') id: string): Promise<UserDetailResponseDto> {
    return this.userDetailsService.findOne(id);
  }

  @Get('profile')
  @ResponseMessage('DATA_004')
  @Serialize(UserDetailResponseDto)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(
    UserRoles.ROOT,
    UserRoles.ADMIN,
    UserRoles.ROOT_STAFF,
    UserRoles.STAFF,
    UserRoles.USER,
  )
  @Throttle({ default: { limit: 30, ttl: 60000 } })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user detail by ID' })
  @ApiResponse({ type: UserDetailResponseDto })
  findProfile(@CurrentUser() user: IUser): Promise<UserDetailResponseDto> {
    return this.userDetailsService.findOne(user.id);
  }

  @Patch(':id')
  @ResponseMessage('DATA_002')
  @Serialize(EmptyResponseDto)
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
  @Roles(UserRoles.ROOT, UserRoles.ADMIN, UserRoles.ROOT_STAFF, UserRoles.STAFF)
  @Permissions(PermissionType.UPDATE, 'user_details')
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update user detail' })
  @ApiResponse({ type: EmptyResponseDto })
  async update(
    @Param('id') id: string,
    @Body() updateUserDetailDto: UpdateUserDetailDto,
    @CurrentUser() user: IUser,
  ): Promise<{ data: Record<string, never> }> {
    updateUserDetailDto.updatedBy = user.id;
    await this.userDetailsService.update(id, updateUserDetailDto);
    return { data: {} };
  }
}
