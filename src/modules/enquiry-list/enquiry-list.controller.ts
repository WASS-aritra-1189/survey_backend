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
  Ip,
  Param,
  Patch,
  Post,
  Query,
  Request,
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
import type { CreateEnquiryListDto } from './dto/create-enquiry-list.dto';
import { EnquiryListResponseDto } from './dto/enquiry-list-response.dto';
import type { QueryEnquiryListDto } from './dto/query-enquiry-list.dto';
import type { UpdateEnquiryListDto } from './dto/update-enquiry-list.dto';
import type { EnquiryList } from './entities/enquiry-list.entity';
import type { IEnquiryListService } from './interfaces/enquiry-list-service.interface';

@ApiTags('Enquiry List')
@Controller('enquiry-list')
export class EnquiryListController {
  constructor(
    @Inject('IEnquiryListService')
    private readonly enquiryListService: IEnquiryListService,
  ) {}

  @Post()
  @ResponseMessage('DATA_001')
  @Serialize(EmptyResponseDto)
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @ApiOperation({ summary: 'Create new enquiry (Public)' })
  @ApiResponse({ type: EmptyResponseDto })
  async create(
    @Body() createEnquiryListDto: CreateEnquiryListDto,
    @Ip() ip: string,
    @Request() req: Request,
  ): Promise<EmptyResponseDto> {
    const userAgent = req.headers['user-agent'] as string | undefined;
    await this.enquiryListService.create(
      createEnquiryListDto,
      ip,
      typeof userAgent === 'string' ? userAgent : undefined,
    );
    return { data: {} };
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
  @ResponseMessage('DATA_004')
  @Serialize(EnquiryListResponseDto)
  @Roles(UserRoles.ROOT, UserRoles.ADMIN, UserRoles.ROOT_STAFF, UserRoles.STAFF)
  @Permissions(PermissionType.READ, 'enquiry')
  @UseInterceptors(CacheInterceptor)
  @CacheKey('enquiry_list_admin')
  @CacheTTL(120)
  @Throttle({ default: { limit: 50, ttl: 60000 } })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all enquiries' })
  @ApiResponse({ type: EnquiryListResponseDto })
  findAll(
    @Query() query: QueryEnquiryListDto,
    @CurrentUser() user: IUser,
  ): Promise<{
    data: EnquiryList[];
    total: number;
    page: number;
    limit: number;
  }> {
    if (user.role !== UserRoles.ROOT && user.role !== UserRoles.ROOT_STAFF) {
      query.settingId = user.settingId;
    }
    return this.enquiryListService.findAll(query);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
  @ResponseMessage('DATA_004')
  @Serialize(EnquiryListResponseDto)
  @Roles(UserRoles.ROOT, UserRoles.ADMIN, UserRoles.ROOT_STAFF, UserRoles.STAFF)
  @Permissions(PermissionType.READ, 'enquiry')
  @Throttle({ default: { limit: 30, ttl: 60000 } })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get enquiry by ID' })
  @ApiResponse({ type: EnquiryListResponseDto })
  findOne(@Param('id') id: string): Promise<EnquiryList> {
    return this.enquiryListService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
  @ResponseMessage('DATA_002')
  @Serialize(EmptyResponseDto)
  @Roles(UserRoles.ROOT, UserRoles.ADMIN, UserRoles.ROOT_STAFF, UserRoles.STAFF)
  @Permissions(PermissionType.UPDATE, 'enquiry')
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update enquiry' })
  @ApiResponse({ type: EmptyResponseDto })
  async update(
    @Param('id') id: string,
    @Body() updateEnquiryListDto: UpdateEnquiryListDto,
    @CurrentUser() user: IUser,
  ): Promise<{ data: Record<string, never> }> {
    updateEnquiryListDto.updatedBy = user.id;
    await this.enquiryListService.update(id, updateEnquiryListDto);
    return { data: {} };
  }

  @Patch(':id/status/:status')
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
  @ResponseMessage('DATA_002')
  @Serialize(EmptyResponseDto)
  @Roles(UserRoles.ROOT, UserRoles.ADMIN, UserRoles.ROOT_STAFF, UserRoles.STAFF)
  @Permissions(PermissionType.UPDATE, 'enquiry')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update enquiry status' })
  @ApiResponse({ type: EmptyResponseDto })
  async updateStatus(
    @Param('id') id: string,
    @Param('status') status: ContactStatus,
    @CurrentUser() user: IUser,
  ): Promise<{ data: Record<string, never> }> {
    await this.enquiryListService.updateStatus(id, status, user.id);
    return { data: {} };
  }

  @Patch(':id/assign/:userId')
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
  @ResponseMessage('DATA_002')
  @Serialize(EmptyResponseDto)
  @Roles(UserRoles.ROOT, UserRoles.ADMIN, UserRoles.ROOT_STAFF)
  @Permissions(PermissionType.UPDATE, 'enquiry')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Assign enquiry to user' })
  @ApiResponse({ type: EmptyResponseDto })
  async assignTo(
    @Param('id') id: string,
    @Param('userId') userId: string,
    @CurrentUser() user: IUser,
  ): Promise<{ data: Record<string, never> }> {
    await this.enquiryListService.assignTo(id, userId, user.id);
    return { data: {} };
  }

  @Post(':id/response')
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
  @ResponseMessage('DATA_002')
  @Serialize(EmptyResponseDto)
  @Roles(UserRoles.ROOT, UserRoles.ADMIN, UserRoles.ROOT_STAFF, UserRoles.STAFF)
  @Permissions(PermissionType.UPDATE, 'enquiry')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add response to enquiry' })
  @ApiResponse({ type: EmptyResponseDto })
  async addResponse(
    @Param('id') id: string,
    @Body('response') response: string,
    @CurrentUser() user: IUser,
  ): Promise<{ data: Record<string, never> }> {
    await this.enquiryListService.addResponse(id, response, user.id);
    return { data: {} };
  }
}
