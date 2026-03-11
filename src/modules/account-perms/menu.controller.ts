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
import { CreateMenuDto } from './dto/create-menu.dto';
import { MenuListResponseDto, MenuResponseDto } from './dto/menu-response.dto';
import { QueryMenuDto } from './dto/query-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { BulkStatusMenuDto } from './dto/bulk-status-menu.dto';
import { Menu } from './entities/menu.entity';
import { IMenuService } from './interfaces/menu-service.interface';

@ApiTags('Menu')
@Controller('menu')
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
@Roles(UserRoles.ROOT, UserRoles.ADMIN, UserRoles.ROOT_STAFF, UserRoles.STAFF)
export class MenuController {
  constructor(
    @Inject('IMenuService') private readonly menuService: IMenuService,
  ) {}

  @Post()
  @ResponseMessage('DATA_001')
  @Serialize(MenuResponseDto)
  @Permissions(PermissionType.CREATE, 'accounts')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create menu' })
  @ApiResponse({ status: 201, type: MenuResponseDto })
  create(@Body() createDto: CreateMenuDto, @CurrentUser() user: IUser) {
    createDto.createdBy = user.id;
    createDto.updatedBy = user.id;
    return this.menuService.create(createDto);
  }

  @Get('list')
  @ResponseMessage('DATA_004')
  @Serialize(MenuListResponseDto)
  @UseInterceptors(CacheInterceptor)
  @CacheKey('menus_list')
  @CacheTTL(120)
  @Roles(UserRoles.ROOT, UserRoles.ADMIN, UserRoles.ROOT_STAFF, UserRoles.STAFF)
  @Permissions(PermissionType.READ, 'accounts')
  @Throttle({ default: { limit: 50, ttl: 60000 } })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all menus' })
  @ApiResponse({ status: 200, type: MenuListResponseDto })
  findAll(@Query() query: QueryMenuDto): Promise<{
    data: Menu[];
    total: number;
    page: number;
    limit: number;
  }> {
    return this.menuService.findAll(query);
  }

  @Patch(':id')
  @ResponseMessage('DATA_002')
  @Serialize(EmptyResponseDto)
  @Permissions(PermissionType.UPDATE, 'accounts')
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update menu' })
  @ApiResponse({ status: 200, type: EmptyResponseDto })
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateMenuDto,
    @CurrentUser() user: IUser,
  ): Promise<{ data: Record<string, never> }> {
    updateDto.updatedBy = user.id;
    await this.menuService.update(id, updateDto);
    return { data: {} };
  }

  @Patch(':id/:status')
  @ResponseMessage('DATA_002')
  @Serialize(MenuResponseDto)
  @Permissions(PermissionType.UPDATE, 'accounts')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update menu status' })
  @ApiResponse({ status: 200, type: MenuResponseDto })
  async status(
    @Param('id') id: string,
    @Param('status') status: DefaultStatus,
    @CurrentUser() user: IUser,
  ): Promise<Menu> {
    return this.menuService.status(id, status, user.id);
  }

  @Patch('bulk-status')
  @ResponseMessage('DATA_002')
  @Serialize(MenuListResponseDto)
  @Permissions(PermissionType.UPDATE, 'accounts')
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Bulk update menu status' })
  @ApiResponse({ status: 200, type: MenuListResponseDto })
  async bulkStatus(
    @Body() body: BulkStatusMenuDto,
    @CurrentUser() user: IUser,
  ): Promise<{ data: Menu[]; total: number; page: number; limit: number }> {
    const updatedMenus = await this.menuService.bulkStatus(body.ids, body.status, user.id);
    return {
      data: updatedMenus,
      total: updatedMenus.length,
      page: 1,
      limit: updatedMenus.length
    };
  }

  @Delete(':id')
  @ResponseMessage('DATA_003')
  @Serialize(EmptyResponseDto)
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
  @Permissions(PermissionType.DELETE, 'accounts')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete menu' })
  @ApiResponse({ status: 200, type: EmptyResponseDto })
  async remove(
    @Param('id') id: string,
    @CurrentUser() user: IUser,
  ): Promise<{ data: Record<string, never> }> {
    await this.menuService.status(id, DefaultStatus.DELETED, user.id);
    return { data: {} };
  }
}
