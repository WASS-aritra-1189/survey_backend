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
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Put,
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
import { SliderStatus } from '../../shared/enums/slider.enum';
import { BulkUpdateSliderDto } from './dto/bulk-update-slider.dto';
import { CreateSliderDto } from './dto/create-slider.dto';
import { QuerySliderDto } from './dto/query-slider.dto';
import {
  SliderListResponseDto,
  SliderResponseDto,
} from './dto/slider-response.dto';
import { UpdateSliderDto } from './dto/update-slider.dto';
import { Slider } from './entities/slider.entity';
import type { ISlidersService } from './interfaces/sliders-service.interface';

@ApiTags('Sliders')
@Controller('sliders')
export class SlidersController {
  constructor(
    @Inject('ISlidersService') private readonly slidersService: ISlidersService,
  ) {}

  @Post()
  @ResponseMessage('DATA_001')
  @Serialize(SliderResponseDto)
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
  @Roles(UserRoles.ROOT, UserRoles.ADMIN, UserRoles.ROOT_STAFF, UserRoles.STAFF)
  @Permissions(PermissionType.CREATE, 'slider')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create new slider' })
  @ApiResponse({ type: SliderResponseDto })
  create(
    @Body() createSliderDto: CreateSliderDto,
    @CurrentUser() user: IUser,
  ): Promise<Slider> {
    // if (user.role !== UserRoles.ROOT && user.role !== UserRoles.ROOT_STAFF) {
    //   createSliderDto.settingId = user.settingId;
    // }
    createSliderDto.createdBy = user.id;
    createSliderDto.updatedBy = user.id;
    return this.slidersService.create(createSliderDto);
  }

  @Get('list')
  @ResponseMessage('DATA_004')
  @Serialize(SliderListResponseDto)
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
  @Roles(UserRoles.ROOT, UserRoles.ADMIN, UserRoles.ROOT_STAFF, UserRoles.STAFF)
  @Permissions(PermissionType.READ, 'slider')
  @UseInterceptors(CacheInterceptor)
  @CacheKey('protected_sliders')
  @CacheTTL(120)
  @Throttle({ default: { limit: 50, ttl: 60000 } })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all sliders' })
  @ApiResponse({ type: SliderListResponseDto })
  findAll(
    @Query() query: QuerySliderDto,
    @CurrentUser() user: IUser,
  ): Promise<{
    data: Slider[];
    total: number;
    page: number;
    limit: number;
  }> {
    if (user.role !== UserRoles.ROOT && user.role !== UserRoles.ROOT_STAFF) {
      query.settingId = user.settingId;
    }
    return this.slidersService.findAll(query);
  }

  @Get()
  @ResponseMessage('DATA_004')
  @Serialize(SliderListResponseDto)
  @UseInterceptors(CacheInterceptor)
  @CacheKey('public_sliders')
  @CacheTTL(120)
  @Throttle({ default: { limit: 50, ttl: 60000 } })
  @ApiOperation({ summary: 'Get all sliders' })
  @ApiResponse({ type: SliderListResponseDto })
  findAllList(
    @Query() query: QuerySliderDto,
    @CurrentUser() user: IUser,
  ): Promise<{
    data: Slider[];
    total: number;
    page: number;
    limit: number;
  }> {
    query.status = [SliderStatus.ACTIVE];
    return this.slidersService.findAll(query);
  }

  @Patch(':id')
  @ResponseMessage('DATA_002')
  @Serialize(EmptyResponseDto)
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
  @Roles(UserRoles.ROOT, UserRoles.ADMIN, UserRoles.ROOT_STAFF, UserRoles.STAFF)
  @Permissions(PermissionType.UPDATE, 'slider')
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update slider' })
  @ApiResponse({ type: EmptyResponseDto })
  async update(
    @Param('id') id: string,
    @Body() updateSliderDto: UpdateSliderDto,
    @CurrentUser() user: IUser,
  ): Promise<{ data: Record<string, never> }> {
    updateSliderDto.updatedBy = user.id;
    await this.slidersService.update(id, updateSliderDto);
    return { data: {} };
  }

  @Put('bulk-update')
  @ResponseMessage('DATA_002')
  @Serialize(EmptyResponseDto)
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
  @Roles(UserRoles.ROOT, UserRoles.ADMIN, UserRoles.ROOT_STAFF, UserRoles.STAFF)
  @Permissions(PermissionType.UPDATE, 'slider')
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Bulk update sliders' })
  @ApiResponse({ type: EmptyResponseDto })
  async bulkUpdate(
    @Body() bulkUpdateSliderDto: BulkUpdateSliderDto,
  ): Promise<{ data: Record<string, never> }> {
    await this.slidersService.bulkUpdate(bulkUpdateSliderDto);
    return { data: {} };
  }

  @Patch(':id/:status')
  @ResponseMessage('DATA_002')
  @Serialize(EmptyResponseDto)
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
  @Roles(UserRoles.ROOT, UserRoles.ADMIN, UserRoles.ROOT_STAFF, UserRoles.STAFF)
  @Permissions(PermissionType.UPDATE, 'slider')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update slider status' })
  @ApiResponse({ type: EmptyResponseDto })
  async status(
    @Param('id') id: string,
    @Param('status') status: SliderStatus,
    @CurrentUser() user: IUser,
  ): Promise<{ data: Record<string, never> }> {
    await this.slidersService.status(id, status, user.id);
    return { data: {} };
  }

  @Delete(':id')
  @ResponseMessage('DATA_002')
  @Serialize(EmptyResponseDto)
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
  @Roles(UserRoles.ROOT, UserRoles.ADMIN, UserRoles.ROOT_STAFF, UserRoles.STAFF)
  @Permissions(PermissionType.DELETE, 'slider')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete slider' })
  @ApiResponse({ type: EmptyResponseDto })
  async delete(
    @Param('id') id: string,
    @CurrentUser() user: IUser,
  ): Promise<{ data: Record<string, never> }> {
    await this.slidersService.status(id, SliderStatus.INACTIVE, user.id);
    return { data: {} };
  }
}
