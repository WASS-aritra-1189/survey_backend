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
  Post,
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
import { QueryStaffDetailDto } from './dto/query-staff-detail.dto';
import {
  StaffDetailResponseDto,
  StaffListResponseDto,
} from './dto/staff-detail-response.dto';
import { UpdateStaffDetailDto } from './dto/update-staff-detail.dto';
import { CreateStaffDetailDto } from './dto/create-staff-detail.dto';
import { StaffDetail } from './entities/staff-detail.entity';
import { IStaffDetailsService } from './interfaces/staff-details-service.interface';

@ApiTags('Staff Details')
@Controller('staff-details')
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
export class StaffDetailsController {
  constructor(
    @Inject('IStaffDetailsService')
    private readonly staffDetailsService: IStaffDetailsService,
  ) {}

  @Get()
  @ResponseMessage('DATA_004')
  @Serialize(StaffListResponseDto)
  @Roles(UserRoles.ROOT, UserRoles.ADMIN, UserRoles.ROOT_STAFF, UserRoles.STAFF)
  @Permissions(PermissionType.READ, 'staff_details')
  @Throttle({ default: { limit: 50, ttl: 60000 } })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all staff details' })
  @ApiResponse({ type: [StaffListResponseDto] })
  findAll(
    @Query() query: QueryStaffDetailDto,
    @CurrentUser() user: IUser,
  ): Promise<{
    data: StaffDetail[];
    total: number;
    page: number;
    limit: number;
  }> {
    if (user.role !== UserRoles.ROOT && user.role !== UserRoles.ROOT_STAFF) {
      query.settingId = user.settingId;
    }
    return this.staffDetailsService.findAll(query);
  }

  @Post()
  @ResponseMessage('DATA_001')
  @Serialize(StaffDetailResponseDto)
  @Roles(UserRoles.ROOT, UserRoles.ADMIN, UserRoles.ROOT_STAFF)
  @Permissions(PermissionType.CREATE, 'staff_details')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create staff detail' })
  @ApiResponse({ type: StaffDetailResponseDto })
  async create(
    @Body() createDto: CreateStaffDetailDto,
    @CurrentUser() user: IUser,
  ): Promise<StaffDetail> {
    createDto.createdBy = user.id;
    return this.staffDetailsService.create(createDto);
  }

  @Get(':id')
  @ResponseMessage('DATA_004')
  @Serialize(StaffDetailResponseDto)
  @Roles(UserRoles.ROOT, UserRoles.ADMIN, UserRoles.ROOT_STAFF, UserRoles.STAFF)
  @Permissions(PermissionType.READ, 'staff_details')
  @Throttle({ default: { limit: 30, ttl: 60000 } })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get staff detail by ID' })
  @ApiResponse({ type: StaffDetailResponseDto })
  findOne(@Param('id') id: string): Promise<StaffDetailResponseDto> {
    return this.staffDetailsService.findOne(id);
  }

  @Get('profile')
  @ResponseMessage('DATA_004')
  @Serialize(StaffDetailResponseDto)
  @Throttle({ default: { limit: 30, ttl: 60000 } })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get staff detail by ID' })
  @ApiResponse({ type: StaffDetailResponseDto })
  findProfile(@CurrentUser() user: IUser): Promise<StaffDetailResponseDto> {
    return this.staffDetailsService.findOne(user.id);
  }

  @Patch(':id')
  @ResponseMessage('DATA_002')
  @Serialize(StaffDetailResponseDto)
  @Roles(UserRoles.ROOT, UserRoles.ADMIN, UserRoles.ROOT_STAFF, UserRoles.STAFF)
  @Permissions(PermissionType.UPDATE, 'staff_details')
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update staff detail' })
  @ApiResponse({ type: StaffDetailResponseDto })
  async update(
    @Param('id') id: string,
    @Body() updateStaffDetailDto: UpdateStaffDetailDto,
    @CurrentUser() user: IUser,
  ): Promise<StaffDetailResponseDto> {
    updateStaffDetailDto.updatedBy = user.id;
     return await this.staffDetailsService.update(id, updateStaffDetailDto);
   
  }
}
