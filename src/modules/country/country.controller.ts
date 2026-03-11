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
import {
  CountryListResponseDto,
  CountryResponseDto,
} from './dto/country-response.dto';
import { CreateCountryDto } from './dto/create-country.dto';
import { QueryCountryDto } from './dto/query-country.dto';
import { UpdateCountryDto } from './dto/update-country.dto';
import { Country } from './entities/country.entity';
import type { ICountryService } from './interfaces/country-service.interface';

@ApiTags('Countries')
@Controller('countries')
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
export class CountryController {
  constructor(
    @Inject('ICountryService') private readonly countryService: ICountryService,
  ) {}

  @Post()
  @ResponseMessage('DATA_001')
  @Serialize(CountryResponseDto)
  @Roles(UserRoles.ROOT, UserRoles.ADMIN, UserRoles.ROOT_STAFF, UserRoles.STAFF)
  @Permissions(PermissionType.CREATE, 'countries')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create new country' })
  @ApiResponse({ type: CountryResponseDto })
  create(
    @Body() createCountryDto: CreateCountryDto,
    @CurrentUser() user: IUser,
  ): Promise<Country> {
    createCountryDto.createdBy = user.id;
    return this.countryService.create(createCountryDto);
  }

  @Get()
  @ResponseMessage('DATA_004')
  @Serialize(CountryListResponseDto)
  @Roles(UserRoles.ROOT, UserRoles.ADMIN, UserRoles.ROOT_STAFF, UserRoles.STAFF)
  @Permissions(PermissionType.READ, 'countries')
  @UseInterceptors(CacheInterceptor)
  @CacheKey('countries_admin')
  @CacheTTL(120)
  @Throttle({ default: { limit: 50, ttl: 60000 } })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all countries' })
  @ApiResponse({ type: CountryListResponseDto })
  findAll(@Query() query: QueryCountryDto): Promise<{
    data: Country[];
    total: number;
    page: number;
    limit: number;
  }> {
    return this.countryService.findAll(query);
  }

  @Patch(':id')
  @ResponseMessage('DATA_002')
  @Serialize(CountryResponseDto)
  @Roles(UserRoles.ROOT, UserRoles.ADMIN, UserRoles.ROOT_STAFF, UserRoles.STAFF)
  @Permissions(PermissionType.UPDATE, 'countries')
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update country' })
  @ApiResponse({ type: CountryResponseDto })
  async update(
    @Param('id') id: string,
    @Body() updateCountryDto: UpdateCountryDto,
    @CurrentUser() user: IUser,
  ): Promise<CountryResponseDto> {
    updateCountryDto.updatedBy = user.id;
    return await this.countryService.update(id, updateCountryDto);
    
  }

  @Patch(':id/:status')
  @ResponseMessage('DATA_002')
  @Serialize(CountryResponseDto)
  @Roles(UserRoles.ROOT, UserRoles.ADMIN, UserRoles.ROOT_STAFF, UserRoles.STAFF)
  @Permissions(PermissionType.UPDATE, 'countries')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update country status' })
  @ApiResponse({ type: CountryResponseDto })
  async status(
    @Param('id') id: string,
    @Param('status') status: DefaultStatus,
    @CurrentUser() user: IUser,
  ): Promise<CountryResponseDto> {
    return await this.countryService.status(id, status, user.id);
    
  }

  @Delete(':id')
  @ResponseMessage('DATA_002')
  @Serialize(CountryResponseDto)
  @Roles(UserRoles.ROOT, UserRoles.ADMIN, UserRoles.ROOT_STAFF, UserRoles.STAFF)
  @Permissions(PermissionType.DELETE, 'countries')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete country' })
  @ApiResponse({ type: CountryResponseDto })
  async delete(
    @Param('id') id: string,
    @CurrentUser() user: IUser,
  ): Promise<CountryResponseDto> {
    return await this.countryService.status(id, DefaultStatus.DELETED, user.id);
    
  }
}
