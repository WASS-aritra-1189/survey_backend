/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from '../../core/decorators/roles.decorator';
import { ResponseMessage } from '../../core/decorators/response-message.decorator';
import { Permissions } from '../../core/decorators/permissions.decorator';
import { Public } from '../../core/decorators/public.decorator';
import { RolesGuard } from '../../core/guards/roles.guard';
import { PermissionsGuard } from '../../core/guards/permissions.guard';
import { MESSAGE_CODES } from '../../shared/constants/message-codes';
import { UserRoles } from '../../shared/enums/accouts.enum';
import { PermissionType } from '../../shared/enums/permissions.enum';
import { CreateSurveyMasterDto } from './dto/create-survey-master.dto';
import { QuerySurveyMasterDto } from './dto/query-survey-master.dto';
import { QueryPerformanceAnalyticsDto } from './dto/query-performance-analytics.dto';
import { SurveyMasterResponseDto } from './dto/survey-master-response.dto';
import { UpdateSurveyMasterDto } from './dto/update-survey-master.dto';
import { UpdateSurveyMasterStatusDto } from './dto/update-survey-master-status.dto';
import { SurveyMasterLoginDto } from './dto/survey-master-login.dto';
import { UpdatePasswordDto } from '../account/dto/update-password.dto';
import { SurveyMasterService } from './survey-master.service';

@ApiTags('survey-master')
@Controller('survey-masters')
export class SurveyMasterController {
  constructor(private readonly surveyMasterService: SurveyMasterService) {}

  @Public()
  @Post('login')
  @ResponseMessage(MESSAGE_CODES.AUTH_LOGIN_SUCCESS.code)
  @ApiOperation({ summary: 'Survey master login' })
  @ApiResponse({ status: 200 })
  async login(@Body() dto: SurveyMasterLoginDto) {
    return await this.surveyMasterService.login(dto.loginId, dto.password);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard, PermissionsGuard)
  @ApiBearerAuth()
  @Post()
  @Roles(UserRoles.ROOT, UserRoles.ADMIN, UserRoles.ROOT_STAFF, UserRoles.STAFF)
  @Permissions(PermissionType.CREATE, 'survey_masters')
  @ResponseMessage(MESSAGE_CODES.DATA_CREATED.code)
  @ApiOperation({ summary: 'Create survey master (Admin, Root, Root Staff, Staff only)' })
  @ApiResponse({ status: 201, type: SurveyMasterResponseDto })
  async create(
    @Body() dto: CreateSurveyMasterDto,
    @Request() req: { user: { sub: string } },
  ) {
    return await this.surveyMasterService.create(dto, req.user.sub);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth()
  @Get('performance-analytics')
  @Roles(UserRoles.ROOT, UserRoles.ADMIN, UserRoles.ROOT_STAFF, UserRoles.STAFF)
  @ResponseMessage(MESSAGE_CODES.DATA_RETRIEVED.code)
  @ApiOperation({ summary: 'Get performance analytics for all survey masters' })
  @ApiResponse({ status: 200 })
  async getPerformanceAnalytics(@Query() query: QueryPerformanceAnalyticsDto) {
    return await this.surveyMasterService.getPerformanceAnalytics(query);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard, PermissionsGuard)
  @ApiBearerAuth()
  @Get()
  @Roles(UserRoles.ROOT, UserRoles.ADMIN, UserRoles.ROOT_STAFF, UserRoles.STAFF)
  @Permissions(PermissionType.READ, 'survey_masters')
  @ResponseMessage(MESSAGE_CODES.DATA_RETRIEVED.code)
  @ApiOperation({ summary: 'Get all survey masters' })
  @ApiResponse({ status: 200, type: [SurveyMasterResponseDto] })
  async findAll(@Query() query: QuerySurveyMasterDto) {
    return await this.surveyMasterService.findAll(query);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard, PermissionsGuard)
  @ApiBearerAuth()
  @Get(':id')
  @Roles(UserRoles.ROOT, UserRoles.ADMIN, UserRoles.ROOT_STAFF, UserRoles.STAFF)
  @Permissions(PermissionType.READ, 'survey_masters')
  @ResponseMessage(MESSAGE_CODES.DATA_RETRIEVED.code)
  @ApiOperation({ summary: 'Get survey master by ID' })
  @ApiResponse({ status: 200, type: SurveyMasterResponseDto })
  async findOne(@Param('id') id: string) {
    return await this.surveyMasterService.findOne(id);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard, PermissionsGuard)
  @ApiBearerAuth()
  @Patch(':id')
  @Roles(UserRoles.ROOT, UserRoles.ADMIN, UserRoles.ROOT_STAFF, UserRoles.STAFF)
  @Permissions(PermissionType.UPDATE, 'survey_masters')
  @ResponseMessage(MESSAGE_CODES.DATA_UPDATED.code)
  @ApiOperation({ summary: 'Update survey master' })
  @ApiResponse({ status: 200, type: SurveyMasterResponseDto })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateSurveyMasterDto,
    @Request() req: { user: { sub: string } },
  ) {
    return await this.surveyMasterService.update(id, dto, req.user.sub);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard, PermissionsGuard)
  @ApiBearerAuth()
  @Patch(':id/status')
  @Roles(UserRoles.ROOT, UserRoles.ADMIN, UserRoles.ROOT_STAFF, UserRoles.STAFF)
  @Permissions(PermissionType.UPDATE, 'survey_masters')
  @ResponseMessage(MESSAGE_CODES.DATA_UPDATED.code)
  @ApiOperation({ summary: 'Update survey master status' })
  @ApiResponse({ status: 200, type: SurveyMasterResponseDto })
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateSurveyMasterStatusDto,
    @Request() req: { user: { sub: string } },
  ) {
    return await this.surveyMasterService.updateStatus(id, dto.status, req.user.sub);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard, PermissionsGuard)
  @ApiBearerAuth()
  @Patch(':id/reset-password')
  @Roles(UserRoles.ROOT, UserRoles.ADMIN, UserRoles.ROOT_STAFF, UserRoles.STAFF)
  @Permissions(PermissionType.UPDATE, 'survey_masters')
  @ResponseMessage(MESSAGE_CODES.DATA_UPDATED.code)
  @ApiOperation({ summary: 'Reset survey master password' })
  @ApiResponse({ status: 200 })
  async resetPassword(
    @Param('id') id: string,
    @Body() dto: UpdatePasswordDto,
    @Request() req: { user: { sub: string } },
  ) {
    await this.surveyMasterService.resetPassword(id, dto, req.user.sub);
    return { message: 'Password reset successfully' };
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard, PermissionsGuard)
  @ApiBearerAuth()
  @Delete(':id')
  @Roles(UserRoles.ROOT, UserRoles.ADMIN, UserRoles.ROOT_STAFF, UserRoles.STAFF)
  @Permissions(PermissionType.DELETE, 'survey_masters')
  @ResponseMessage(MESSAGE_CODES.DATA_DELETED.code)
  @ApiOperation({ summary: 'Delete survey master' })
  @ApiResponse({ status: 200 })
  async remove(@Param('id') id: string) {
    await this.surveyMasterService.remove(id);
    return { message: 'Survey master deleted successfully' };
  }
}
