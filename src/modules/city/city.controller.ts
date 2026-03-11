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
import { CityListResponseDto, CityResponseDto } from './dto/city-response.dto';
import { CreateCityDto } from './dto/create-city.dto';
import { QueryCityDto } from './dto/query-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';
import { City } from './entities/city.entity';
import type { ICityService } from './interfaces/city-service.interface';

@ApiTags('Cities')
@Controller('cities')
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
export class CityController {
  constructor(
    @Inject('ICityService') private readonly cityService: ICityService,
  ) {}

  @Post()
  @ResponseMessage('DATA_001')
  @Serialize(CityResponseDto)
  @Roles(UserRoles.ROOT, UserRoles.ADMIN, UserRoles.ROOT_STAFF, UserRoles.STAFF)
  @Permissions(PermissionType.CREATE, 'cities')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create new city' })
  @ApiResponse({ type: CityResponseDto })
  create(
    @Body() createCityDto: CreateCityDto,
    @CurrentUser() user: IUser,
  ): Promise<City> {
    createCityDto.createdBy = user.id;
    return this.cityService.create(createCityDto);
  }

  @Get()
  @ResponseMessage('DATA_004')
  @Serialize(CityListResponseDto)
  @Roles(UserRoles.ROOT, UserRoles.ADMIN, UserRoles.ROOT_STAFF, UserRoles.STAFF)
  @Permissions(PermissionType.READ, 'cities')
  @UseInterceptors(CacheInterceptor)
  @CacheKey('cities_admin')
  @CacheTTL(120)
  @Throttle({ default: { limit: 50, ttl: 60000 } })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all cities' })
  @ApiResponse({ type: CityListResponseDto })
  findAll(@Query() query: QueryCityDto): Promise<{
    data: City[];
    total: number;
    page: number;
    limit: number;
  }> {
    return this.cityService.findAll(query);
  }

  @Patch(':id')
  @ResponseMessage('DATA_002')
  @Serialize(CityResponseDto)
  @Roles(UserRoles.ROOT, UserRoles.ADMIN, UserRoles.ROOT_STAFF, UserRoles.STAFF)
  @Permissions(PermissionType.UPDATE, 'cities')
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update city' })
  @ApiResponse({ type: CityResponseDto })
  async update(
    @Param('id') id: string,
    @Body() updateCityDto: UpdateCityDto,
    @CurrentUser() user: IUser,
  ): Promise<CityResponseDto> {
    updateCityDto.updatedBy = user.id;
    return await this.cityService.update(id, updateCityDto);
    
  }

  @Patch(':id/:status')
  @ResponseMessage('DATA_002')
  @Serialize(CityResponseDto)
  @Roles(UserRoles.ROOT, UserRoles.ADMIN, UserRoles.ROOT_STAFF, UserRoles.STAFF)
  @Permissions(PermissionType.UPDATE, 'cities')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update city status' })
  @ApiResponse({ type: CityResponseDto})
  async status(
    @Param('id') id: string,
    @Param('status') status: DefaultStatus,
    @CurrentUser() user: IUser,
  ): Promise<CityResponseDto> {
    return await this.cityService.status(id, status, user.id);
    
  }

  @Delete(':id')
  @ResponseMessage('DATA_002')
  @Serialize(CityResponseDto)
  @Roles(UserRoles.ROOT, UserRoles.ADMIN, UserRoles.ROOT_STAFF, UserRoles.STAFF)
  @Permissions(PermissionType.DELETE, 'cities')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete city' })
  @ApiResponse({ type: CityResponseDto })
  async delete(
    @Param('id') id: string,
    @CurrentUser() user: IUser,
  ): Promise<CityResponseDto> {
    return await this.cityService.status(id, DefaultStatus.DELETED, user.id);
    
  }
}
