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
import { CreateNewsLetterDto } from './dto/create-news-letter.dto';
import {
  NewsLetterListResponseDto,
  NewsLetterResponseDto,
} from './dto/news-letter-response.dto';
import { QueryNewsLetterDto } from './dto/query-news-letter.dto';
import { UpdateNewsLetterDto } from './dto/update-news-letter.dto';
import { NewsLetter } from './entities/news-letter.entity';
import type { INewsLettersService } from './interfaces/news-letters-service.interface';

@ApiTags('Newsletters')
@Controller('news-letters')
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
export class NewsLettersController {
  constructor(
    @Inject('INewsLettersService')
    private readonly newsLettersService: INewsLettersService,
  ) {}

  @Post()
  @ResponseMessage('DATA_001')
  @Serialize(NewsLetterResponseDto)
  @Roles(UserRoles.ROOT, UserRoles.ADMIN, UserRoles.ROOT_STAFF, UserRoles.STAFF)
  @Permissions(PermissionType.CREATE, 'newsletter')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create newsletter' })
  @ApiResponse({ status: 201, type: NewsLetterResponseDto })
  create(@Body() createDto: CreateNewsLetterDto, @CurrentUser() user: IUser) {
    // createDto.settingId = user.settingId;
    createDto.createdBy = user.id;
    createDto.updatedBy = user.id;
    return this.newsLettersService.create(createDto);
  }

  @Get('list')
  @ResponseMessage('DATA_004')
  @Serialize(NewsLetterListResponseDto)
  @UseInterceptors(CacheInterceptor)
  @CacheKey('newsletters_list')
  @CacheTTL(120)
  @Throttle({ default: { limit: 50, ttl: 60000 } })
  @ApiOperation({ summary: 'Get all newsletters' })
  @ApiResponse({ status: 200, type: NewsLetterListResponseDto })
  findAll(
    @Query() query: QueryNewsLetterDto,
    @CurrentUser() user: IUser,
  ): Promise<{
    data: NewsLetter[];
    total: number;
    page: number;
    limit: number;
  }> {
    if (user.role !== UserRoles.ROOT && user.role != UserRoles.ROOT_STAFF) {
      query.settingId = user.settingId;
    }
    return this.newsLettersService.findAll(query);
  }

  @Get()
  @ResponseMessage('DATA_004')
  @Serialize(NewsLetterListResponseDto)
  @UseInterceptors(CacheInterceptor)
  @CacheKey('newsletters_active')
  @CacheTTL(300)
  @Throttle({ default: { limit: 100, ttl: 60000 } })
  @ApiOperation({ summary: 'Get active newsletters' })
  @ApiResponse({ status: 200, type: NewsLetterListResponseDto })
  findActive(@Query() query: QueryNewsLetterDto): Promise<{
    data: NewsLetter[];
    total: number;
    page: number;
    limit: number;
  }> {
    query.status = [DefaultStatus.ACTIVE];
    return this.newsLettersService.findAll(query);
  }

  @Get(':id')
  @ResponseMessage('DATA_004')
  @Serialize(NewsLetterResponseDto)
  @UseInterceptors(CacheInterceptor)
  @CacheKey('newsletter_by_id')
  @CacheTTL(300)
  @Roles(UserRoles.ROOT, UserRoles.ADMIN, UserRoles.ROOT_STAFF, UserRoles.STAFF)
  @Permissions(PermissionType.READ, 'newsletter')
  @Throttle({ default: { limit: 100, ttl: 60000 } })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get newsletter by ID' })
  @ApiResponse({ status: 200, type: NewsLetterResponseDto })
  findOne(@Param('id') id: string): Promise<NewsLetter> {
    return this.newsLettersService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage('DATA_002')
  @Serialize(EmptyResponseDto)
  @Roles(UserRoles.ROOT, UserRoles.ADMIN, UserRoles.ROOT_STAFF, UserRoles.STAFF)
  @Permissions(PermissionType.UPDATE, 'newsletter')
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update newsletter' })
  @ApiResponse({ status: 200, type: EmptyResponseDto })
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateNewsLetterDto,
    @CurrentUser() user: IUser,
  ): Promise<{ data: Record<string, never> }> {
    updateDto.updatedBy = user.id;
    await this.newsLettersService.update(id, updateDto);
    return { data: {} };
  }

  @Patch(':id/:status')
  @ResponseMessage('DATA_002')
  @Serialize(EmptyResponseDto)
  @Roles(UserRoles.ROOT, UserRoles.ADMIN, UserRoles.ROOT_STAFF, UserRoles.STAFF)
  @Permissions(PermissionType.UPDATE, 'newsletter')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Toggle newsletter status' })
  @ApiResponse({ status: 200, type: EmptyResponseDto })
  async toggleStatus(
    @Param('id') id: string,
    @Param('status') status: DefaultStatus,
    @CurrentUser() user: IUser,
  ): Promise<{ data: Record<string, never> }> {
    await this.newsLettersService.status(id, status, user.id);
    return { data: {} };
  }

  @Delete(':id')
  @ResponseMessage('DATA_003')
  @Serialize(EmptyResponseDto)
  @Roles(UserRoles.ROOT, UserRoles.ADMIN, UserRoles.ROOT_STAFF, UserRoles.STAFF)
  @Permissions(PermissionType.DELETE, 'newsletter')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete newsletter' })
  @ApiResponse({ status: 200, type: EmptyResponseDto })
  async remove(
    @Param('id') id: string,
  ): Promise<{ data: Record<string, never> }> {
    await this.newsLettersService.remove(id);
    return { data: {} };
  }
}
