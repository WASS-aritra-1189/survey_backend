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
import { CreateStateDto } from './dto/create-state.dto';
import { QueryStateDto } from './dto/query-state.dto';
import {
  StateListResponseDto,
  StateResponseDto,
} from './dto/state-response.dto';
import { UpdateStateDto } from './dto/update-state.dto';
import { State } from './entities/state.entity';
import type { IStateService } from './interfaces/state-service.interface';
import { stat } from 'fs';

@ApiTags('States')
@Controller('states')
export class StateController {
  constructor(
    @Inject('IStateService') private readonly stateService: IStateService,
  ) {}

  @Post()
  @ResponseMessage('DATA_001')
  @Serialize(StateResponseDto)
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
  @Roles(UserRoles.ROOT, UserRoles.ADMIN, UserRoles.ROOT_STAFF, UserRoles.STAFF)
  @Permissions(PermissionType.CREATE, 'states')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create new state' })
  @ApiResponse({ type: StateResponseDto })
  create(
    @Body() createStateDto: CreateStateDto,
    @CurrentUser() user: IUser,
  ): Promise<State> {
    createStateDto.createdBy = user.id;
    return this.stateService.create(createStateDto);
  }

  @Get('list')
  @ResponseMessage('DATA_004')
  @Serialize(StateListResponseDto)
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
  @Roles(UserRoles.ROOT, UserRoles.ADMIN, UserRoles.ROOT_STAFF, UserRoles.STAFF)
  @Permissions(PermissionType.READ, 'states')
  @UseInterceptors(CacheInterceptor)
  @CacheKey('protected_states')
  @CacheTTL(120)
  @Throttle({ default: { limit: 50, ttl: 60000 } })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all states' })
  @ApiResponse({ type: StateListResponseDto })
  findList(@Query() query: QueryStateDto): Promise<{
    data: State[];
    total: number;
    page: number;
    limit: number;
  }> {
    return this.stateService.findAll(query);
  }

  @Get()
  @ResponseMessage('DATA_004')
  @Serialize(StateListResponseDto)
  @UseInterceptors(CacheInterceptor)
  @CacheKey('public_states')
  @CacheTTL(120)
  @Throttle({ default: { limit: 50, ttl: 60000 } })
  @ApiOperation({ summary: 'Get all states' })
  @ApiResponse({ type: StateListResponseDto })
  findAll(@Query() query: QueryStateDto): Promise<{
    data: State[];
    total: number;
    page: number;
    limit: number;
  }> {
    query.status = [DefaultStatus.ACTIVE];
    return this.stateService.findAll(query);
  }

  @Patch(':id')
  @ResponseMessage('DATA_002')
  @Serialize(StateResponseDto)
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
  @Roles(UserRoles.ROOT, UserRoles.ADMIN, UserRoles.ROOT_STAFF, UserRoles.STAFF)
  @Permissions(PermissionType.UPDATE, 'states')
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update state' })
  @ApiResponse({ type: StateResponseDto })
  async update(
    @Param('id') id: string,
    @Body() updateStateDto: UpdateStateDto,
    @CurrentUser() user: IUser,
  ): Promise<StateResponseDto> {
    updateStateDto.updatedBy = user.id;
    return await this.stateService.update(id, updateStateDto);
    
  }

  @Patch(':id/:status')
  @ResponseMessage('DATA_002')
  @Serialize(StateResponseDto)
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
  @Roles(UserRoles.ROOT, UserRoles.ADMIN, UserRoles.ROOT_STAFF, UserRoles.STAFF)
  @Permissions(PermissionType.UPDATE, 'states')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update state status' })
  @ApiResponse({ type: StateResponseDto })
  async status(
    @Param('id') id: string,
    @Param('status') status: DefaultStatus,
    @CurrentUser() user: IUser,
  ): Promise<StateResponseDto> {
    return await this.stateService.status(id, status, user.id);
    
  }

  @Delete(':id')
  @ResponseMessage('DATA_002')
  @Serialize(StateResponseDto)
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
  @Roles(UserRoles.ROOT, UserRoles.ADMIN, UserRoles.ROOT_STAFF, UserRoles.STAFF)
  @Permissions(PermissionType.DELETE, 'states')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete state' })
  @ApiResponse({ type: StateResponseDto})
  async delete(
    @Param('id') id: string,
    @CurrentUser() user: IUser,
  ): Promise<StateResponseDto> {
    return await this.stateService.status(id, DefaultStatus.DELETED, user.id);
    
  }
}
