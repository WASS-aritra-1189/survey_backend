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
import { ContactStatus } from '../../shared/enums/contact-status.enum';
import { PermissionType } from '../../shared/enums/permissions.enum';
import {
  ContactUsListResponseDto,
  ContactUsResponseDto,
} from './dto/contact-us-history-response.dto';
import { CreateContactUsHistoryDto } from './dto/create-contact-us-history.dto';
import { QueryContactUsHistoryDto } from './dto/query-contact-us-history.dto';
import { UpdateContactUsHistoryDto } from './dto/update-contact-us-history.dto';
import { ContactUsHistory } from './entities/contact-us-history.entity';
import type { IContactUsHistoryService } from './interfaces/contact-us-history-service.interface';

@ApiTags('Contact Us History')
@Controller('contact-us-history')
export class ContactUsHistoryController {
  constructor(
    @Inject('IContactUsHistoryService')
    private readonly contactUsHistoryService: IContactUsHistoryService,
  ) {}

  @Post()
  @ResponseMessage('DATA_001')
  @Serialize(EmptyResponseDto)
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiOperation({ summary: 'Create new contact us entry' })
  @ApiResponse({ type: EmptyResponseDto })
  async create(
    @Body() createContactUsHistoryDto: CreateContactUsHistoryDto,
  ): Promise<EmptyResponseDto> {
    await this.contactUsHistoryService.create(createContactUsHistoryDto);
    return { data: {} };
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
  @ResponseMessage('DATA_004')
  @Serialize(ContactUsListResponseDto)
  @Roles(UserRoles.ROOT, UserRoles.ADMIN, UserRoles.ROOT_STAFF, UserRoles.STAFF)
  @Permissions(PermissionType.READ, 'contact')
  @UseInterceptors(CacheInterceptor)
  @CacheKey('contact_us_history_admin')
  @CacheTTL(120)
  @Throttle({ default: { limit: 50, ttl: 60000 } })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all contact us entries' })
  @ApiResponse({ type: ContactUsListResponseDto })
  findAll(
    @Query() query: QueryContactUsHistoryDto,
    @CurrentUser() user: IUser,
  ): Promise<{
    data: ContactUsHistory[];
    total: number;
    page: number;
    limit: number;
  }> {
    if (user.role !== UserRoles.ROOT && user.role !== UserRoles.ROOT_STAFF) {
      query.settingId = user.settingId;
    }
    return this.contactUsHistoryService.findAll(query);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
  @ResponseMessage('DATA_004')
  @Serialize(ContactUsResponseDto)
  @Roles(UserRoles.ROOT, UserRoles.ADMIN, UserRoles.ROOT_STAFF, UserRoles.STAFF)
  @Permissions(PermissionType.READ, 'contact')
  @Throttle({ default: { limit: 30, ttl: 60000 } })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get contact us entry by ID' })
  @ApiResponse({ type: ContactUsResponseDto })
  findOne(@Param('id') id: string): Promise<ContactUsHistory> {
    return this.contactUsHistoryService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
  @ResponseMessage('DATA_002')
  @Serialize(EmptyResponseDto)
  @Roles(UserRoles.ROOT, UserRoles.ADMIN, UserRoles.ROOT_STAFF, UserRoles.STAFF)
  @Permissions(PermissionType.UPDATE, 'contact')
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update contact us entry' })
  @ApiResponse({ type: EmptyResponseDto })
  async update(
    @Param('id') id: string,
    @Body() updateContactUsHistoryDto: UpdateContactUsHistoryDto,
    @CurrentUser() user: IUser,
  ): Promise<{ data: Record<string, never> }> {
    updateContactUsHistoryDto.updatedBy = user.id;
    await this.contactUsHistoryService.update(id, updateContactUsHistoryDto);
    return { data: {} };
  }

  @Patch(':id/status/:status')
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
  @ResponseMessage('DATA_002')
  @Serialize(EmptyResponseDto)
  @Roles(UserRoles.ROOT, UserRoles.ADMIN, UserRoles.ROOT_STAFF, UserRoles.STAFF)
  @Permissions(PermissionType.UPDATE, 'contact')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update contact us entry status' })
  @ApiResponse({ type: EmptyResponseDto })
  async updateStatus(
    @Param('id') id: string,
    @Param('status') status: ContactStatus,
    @CurrentUser() user: IUser,
  ): Promise<{ data: Record<string, never> }> {
    await this.contactUsHistoryService.updateStatus(id, status, user.id);
    return { data: {} };
  }
}
