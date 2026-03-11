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
import { DefaultStatus } from '../../shared/enums/status.enum';
import { CreateDesignationDto } from './dto/create-designation.dto';
import {
  DesignationListResponseDto,
  DesignationResponseDto,
} from './dto/designation-response.dto';
import { QueryDesignationDto } from './dto/query-designation.dto';
import { UpdateDesignationDto } from './dto/update-designation.dto';
import { Designation } from './entities/designation.entity';
import type { IDesignationsService } from './interfaces/designations-service.interface';

@ApiTags('Designations')
@Controller('designations')
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
export class DesignationsController {
  constructor(
    @Inject('IDesignationsService')
    private readonly designationsService: IDesignationsService,
  ) {}

  @Post()
  @ResponseMessage('DATA_001')
  @Serialize(DesignationResponseDto)
  @Roles(UserRoles.ROOT, UserRoles.ADMIN, UserRoles.ROOT_STAFF, UserRoles.STAFF)
  @Permissions(PermissionType.CREATE, 'designations')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create new designation' })
  @ApiResponse({ type: DesignationResponseDto })
  create(
    @Body() createDesignationDto: CreateDesignationDto,
    @CurrentUser() user: IUser,
  ): Promise<Designation> {
    if (!createDesignationDto.settingId && user.settingId) {
      createDesignationDto.settingId = user.settingId;
    }
    createDesignationDto.createdBy = user.id;
    createDesignationDto.updatedBy = user.id;
    return this.designationsService.create(createDesignationDto);
  }

  @Get()
  @ResponseMessage('DATA_004')
  @Serialize(DesignationListResponseDto)
  @Roles(UserRoles.ROOT, UserRoles.ADMIN, UserRoles.ROOT_STAFF, UserRoles.STAFF)
  @Permissions(PermissionType.READ, 'designations')
  @UseInterceptors(CacheInterceptor)
  @CacheKey('designations_admin')
  @CacheTTL(120)
  @Throttle({ default: { limit: 50, ttl: 60000 } })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all designations' })
  @ApiResponse({ type: DesignationListResponseDto })
  findAll(
    @Query() query: QueryDesignationDto,
    @CurrentUser() user: IUser,
  ): Promise<{
    data: Designation[];
    total: number;
    page: number;
    limit: number;
  }> {
    if (user.role !== UserRoles.ROOT && user.role !== UserRoles.ROOT_STAFF) {
      query.settingId = user.settingId;
    }
    return this.designationsService.findAll(query);
  }

  @Patch(':id')
  @ResponseMessage('DATA_002')
  @Serialize(DesignationResponseDto)
  @Roles(UserRoles.ROOT, UserRoles.ADMIN, UserRoles.ROOT_STAFF, UserRoles.STAFF)
  @Permissions(PermissionType.UPDATE, 'designations')
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update designation (Admin only)' })
  @ApiResponse({ type: DesignationResponseDto })
  async update(
    @Param('id') id: string,
    @Body() updateDesignationDto: UpdateDesignationDto,
    @CurrentUser() user: IUser,
  ): Promise<Designation> {
    updateDesignationDto.updatedBy = user.id;
    return await this.designationsService.update(id, updateDesignationDto);
  }

  @Patch(':id/:status')
  @ResponseMessage('DATA_002')
  @Serialize(DesignationResponseDto)
  @Roles(UserRoles.ROOT, UserRoles.ADMIN, UserRoles.ROOT_STAFF, UserRoles.STAFF)
  @Permissions(PermissionType.UPDATE, 'designations')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update designation status' })
  @ApiResponse({ type: DesignationResponseDto })
  async status(
    @Param('id') id: string,
    @Param('status') status: DefaultStatus,
    @CurrentUser() user: IUser,
  ): Promise<Designation> {
    return await this.designationsService.status(id, status, user.id);
  }
  
  @Delete(':id')
  @ResponseMessage('DATA_002')
  @Serialize(DesignationResponseDto)
  @Roles(UserRoles.ROOT, UserRoles.ADMIN, UserRoles.ROOT_STAFF, UserRoles.STAFF)
  @Permissions(PermissionType.DELETE, 'designations')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete designation' })
  @ApiResponse({ type: DesignationResponseDto })
  async delete(
    @Param('id') id: string,
    @CurrentUser() user: IUser,
  ): Promise<DesignationResponseDto> {
    return await this.designationsService.status(id, DefaultStatus.DELETED, user.id);
    
  }
}
