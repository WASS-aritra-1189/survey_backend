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
  Logger,
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
import { CurrentUser } from '../../core/decorators/current-user.decorator';
import { RolesGuard } from '../../core/guards/roles.guard';
import { PermissionsGuard } from '../../core/guards/permissions.guard';
import { MESSAGE_CODES } from '../../shared/constants/message-codes';
import { UserRoles } from '../../shared/enums/accouts.enum';
import { PermissionType } from '../../shared/enums/permissions.enum';
import { CreateSurveyDto } from './dto/create-survey.dto';
import { QuerySurveyDto } from './dto/query-survey.dto';
import { UpdateSurveyDto } from './dto/update-survey.dto';
import { UpdateSurveyStatusDto } from './dto/update-survey-status.dto';
import { AssignSurveyMasterDto } from './dto/assign-survey-master.dto';
import { AssignSurveyMasterWithLocationDto, LocationConstraintDto } from './dto/assign-survey-master-with-location.dto';
import { BulkAssignSurveyMasterDto } from './dto/bulk-assign-survey-master.dto';
import { SurveyService } from './surveys.service';

@ApiTags('surveys')
@Controller('surveys')
export class SurveyController {
  private readonly logger = new Logger(SurveyController.name);

  constructor(private readonly surveyService: SurveyService) {}

  @Get('public/:id')
  @ResponseMessage(MESSAGE_CODES.DATA_RETRIEVED.code)
  @ApiOperation({ summary: 'Get public survey by ID (no auth required)' })
  @ApiResponse({ status: 200 })
  async getPublicSurvey(@Param('id') id: string) {
    return await this.surveyService.findOne(id);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard, PermissionsGuard)
  @ApiBearerAuth()
  @Roles(UserRoles.ROOT, UserRoles.ADMIN, UserRoles.ROOT_STAFF, UserRoles.STAFF)
  @Permissions(PermissionType.CREATE, 'surveys')
  @ResponseMessage(MESSAGE_CODES.DATA_CREATED.code)
  @ApiOperation({ summary: 'Create survey with multiple questions' })
  @ApiResponse({ status: 201 })
  async create(
    @Body() dto: CreateSurveyDto,
    @Request() req: { user: { sub: string } },
  ) {
    return await this.surveyService.create(dto, req.user.sub);
  }

  @Get('my-surveys')
  @UseGuards(AuthGuard('jwt'), RolesGuard, PermissionsGuard)
  @ApiBearerAuth()
  @ResponseMessage(MESSAGE_CODES.DATA_RETRIEVED.code)
  @ApiOperation({ summary: 'Get surveys assigned to logged-in survey master' })
  @ApiResponse({ status: 200 })
  async getMySurveys(
    @Query() query: QuerySurveyDto,
    @CurrentUser() user: any,
  ) {
    const userId = user.sub || user.id;
    return await this.surveyService.findAssignedSurveys(userId, query);
  }

  @Get('my-surveys/:id')
  @UseGuards(AuthGuard('jwt'), RolesGuard, PermissionsGuard)
  @ApiBearerAuth()
  @ResponseMessage(MESSAGE_CODES.DATA_RETRIEVED.code)
  @ApiOperation({ summary: 'Get survey by ID for survey master' })
  @ApiResponse({ status: 200 })
  async getMySurveyById(
    @Param('id') id: string,
    @CurrentUser() user: any,
  ) {
    const userId = user.sub || user.id;
    return await this.surveyService.findOneForSurveyMaster(id, userId);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'), RolesGuard, PermissionsGuard)
  @ApiBearerAuth()
  @Roles(UserRoles.ROOT, UserRoles.ADMIN, UserRoles.ROOT_STAFF, UserRoles.STAFF)
  @Permissions(PermissionType.READ, 'surveys')
  @ResponseMessage(MESSAGE_CODES.DATA_RETRIEVED.code)
  @ApiOperation({ summary: 'Get all surveys with search and filter' })
  @ApiResponse({ status: 200 })
  async findAll(@Query() query: QuerySurveyDto) {
    return await this.surveyService.findAll(query);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard, PermissionsGuard)
  @ApiBearerAuth()
  @Roles(UserRoles.ROOT, UserRoles.ADMIN, UserRoles.ROOT_STAFF, UserRoles.STAFF)
  @Permissions(PermissionType.READ, 'surveys')
  @ResponseMessage(MESSAGE_CODES.DATA_RETRIEVED.code)
  @ApiOperation({ summary: 'Get survey details by ID' })
  @ApiResponse({ status: 200 })
  async findOne(@Param('id') id: string) {
    return await this.surveyService.findOne(id);
  }

  @Get(':id/questions')
  @UseGuards(AuthGuard('jwt'), RolesGuard, PermissionsGuard)
  @ApiBearerAuth()
  @Roles(UserRoles.ROOT, UserRoles.ADMIN, UserRoles.ROOT_STAFF, UserRoles.STAFF)
  @Permissions(PermissionType.READ, 'surveys')
  @ResponseMessage(MESSAGE_CODES.DATA_RETRIEVED.code)
  @ApiOperation({ summary: 'Get all questions for a survey' })
  @ApiResponse({ status: 200 })
  async getQuestions(@Param('id') id: string) {
    return await this.surveyService.getQuestions(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard, PermissionsGuard)
  @ApiBearerAuth()
  @Roles(UserRoles.ROOT, UserRoles.ADMIN, UserRoles.ROOT_STAFF, UserRoles.STAFF)
  @Permissions(PermissionType.UPDATE, 'surveys')
  @ResponseMessage(MESSAGE_CODES.DATA_UPDATED.code)
  @ApiOperation({ summary: 'Update survey' })
  @ApiResponse({ status: 200 })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateSurveyDto,
    @Request() req: { user: { sub: string } },
  ) {
    return await this.surveyService.update(id, dto, req.user.sub);
  }

  @Patch(':id/status')
  @UseGuards(AuthGuard('jwt'), RolesGuard, PermissionsGuard)
  @ApiBearerAuth()
  @Roles(UserRoles.ROOT, UserRoles.ADMIN, UserRoles.ROOT_STAFF, UserRoles.STAFF)
  @Permissions(PermissionType.UPDATE, 'surveys')
  @ResponseMessage(MESSAGE_CODES.DATA_UPDATED.code)
  @ApiOperation({ summary: 'Update survey status' })
  @ApiResponse({ status: 200 })
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateSurveyStatusDto,
    @Request() req: { user: { sub: string } },
  ) {
    return await this.surveyService.updateStatus(id, dto.status, req.user.sub);
  }

  @Patch(':id/assign')
  @UseGuards(AuthGuard('jwt'), RolesGuard, PermissionsGuard)
  @ApiBearerAuth()
  @Roles(UserRoles.ROOT, UserRoles.ADMIN, UserRoles.ROOT_STAFF, UserRoles.STAFF)
  @Permissions(PermissionType.UPDATE, 'surveys')
  @ResponseMessage(MESSAGE_CODES.DATA_UPDATED.code)
  @ApiOperation({ summary: 'Assign survey to survey master with optional location constraint' })
  @ApiResponse({ status: 200 })
  async assignToSurveyMaster(
    @Param('id') id: string,
    @Body() dto: AssignSurveyMasterWithLocationDto,
    @Request() req: { user: { sub: string } },
  ) {
    return await this.surveyService.assignWithLocation(id, dto.surveyMasterId, dto.locationConstraint, req.user.sub);
  }

  @Get(':id/location/:surveyMasterId')
  @UseGuards(AuthGuard('jwt'), RolesGuard, PermissionsGuard)
  @ApiBearerAuth()
  @Roles(UserRoles.ROOT, UserRoles.ADMIN, UserRoles.ROOT_STAFF, UserRoles.STAFF)
  @Permissions(PermissionType.READ, 'surveys')
  @ResponseMessage(MESSAGE_CODES.DATA_RETRIEVED.code)
  @ApiOperation({ summary: 'Get location constraint for survey-master assignment' })
  @ApiResponse({ status: 200 })
  async getLocationConstraint(
    @Param('id') id: string,
    @Param('surveyMasterId') surveyMasterId: string,
  ) {
    return await this.surveyService.getLocationConstraint(id, surveyMasterId);
  }

  @Patch(':id/location/:surveyMasterId')
  @UseGuards(AuthGuard('jwt'), RolesGuard, PermissionsGuard)
  @ApiBearerAuth()
  @Roles(UserRoles.ROOT, UserRoles.ADMIN, UserRoles.ROOT_STAFF, UserRoles.STAFF)
  @Permissions(PermissionType.UPDATE, 'surveys')
  @ResponseMessage(MESSAGE_CODES.DATA_UPDATED.code)
  @ApiOperation({ summary: 'Update location constraint' })
  @ApiResponse({ status: 200 })
  async updateLocationConstraint(
    @Param('id') id: string,
    @Param('surveyMasterId') surveyMasterId: string,
    @Body() dto: LocationConstraintDto,
    @Request() req: { user: { sub: string } },
  ) {
    return await this.surveyService.updateLocationConstraint(id, surveyMasterId, dto, req.user.sub);
  }

  @Delete(':id/location/:surveyMasterId')
  @UseGuards(AuthGuard('jwt'), RolesGuard, PermissionsGuard)
  @ApiBearerAuth()
  @Roles(UserRoles.ROOT, UserRoles.ADMIN, UserRoles.ROOT_STAFF, UserRoles.STAFF)
  @Permissions(PermissionType.DELETE, 'surveys')
  @ResponseMessage(MESSAGE_CODES.DATA_DELETED.code)
  @ApiOperation({ summary: 'Remove location constraint' })
  @ApiResponse({ status: 200 })
  async removeLocationConstraint(
    @Param('id') id: string,
    @Param('surveyMasterId') surveyMasterId: string,
  ) {
    await this.surveyService.removeLocationConstraint(id, surveyMasterId);
    return { message: 'Location constraint removed successfully' };
  }

  @Post(':id/bulk-assign')
  @UseGuards(AuthGuard('jwt'), RolesGuard, PermissionsGuard)
  @ApiBearerAuth()
  @Roles(UserRoles.ROOT, UserRoles.ADMIN, UserRoles.ROOT_STAFF, UserRoles.STAFF)
  @Permissions(PermissionType.CREATE, 'surveys')
  @ResponseMessage(MESSAGE_CODES.DATA_CREATED.code)
  @ApiOperation({ summary: 'Bulk assign survey to multiple survey masters' })
  @ApiResponse({ status: 201 })
  async bulkAssignToSurveyMasters(
    @Param('id') id: string,
    @Body() dto: BulkAssignSurveyMasterDto,
    @Request() req: { user: { sub: string } },
  ) {
    return await this.surveyService.bulkAssignToSurveyMasters(id, dto.surveyMasterIds, req.user.sub);
  }

  @Get(':id/assignees')
  @UseGuards(AuthGuard('jwt'), RolesGuard, PermissionsGuard)
  @ApiBearerAuth()
  @Roles(UserRoles.ROOT, UserRoles.ADMIN, UserRoles.ROOT_STAFF, UserRoles.STAFF)
  @Permissions(PermissionType.READ, 'surveys')
  @ResponseMessage(MESSAGE_CODES.DATA_RETRIEVED.code)
  @ApiOperation({ summary: 'Get all assignees for a survey' })
  @ApiResponse({ status: 200 })
  async getAssignees(@Param('id') id: string) {
    return await this.surveyService.getAssignees(id);
  }

  @Delete(':id/unassign/:surveyMasterId')
  @UseGuards(AuthGuard('jwt'), RolesGuard, PermissionsGuard)
  @ApiBearerAuth()
  @Roles(UserRoles.ROOT, UserRoles.ADMIN, UserRoles.ROOT_STAFF, UserRoles.STAFF)
  @Permissions(PermissionType.UPDATE, 'surveys')
  @ResponseMessage(MESSAGE_CODES.DATA_UPDATED.code)
  @ApiOperation({ summary: 'Unassign survey from survey master' })
  @ApiResponse({ status: 200 })
  async unassignFromSurveyMaster(
    @Param('id') id: string,
    @Param('surveyMasterId') surveyMasterId: string,
    @Request() req: { user: { sub: string } },
  ) {
    return await this.surveyService.unassignFromSurveyMaster(id, surveyMasterId, req.user.sub);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard, PermissionsGuard)
  @ApiBearerAuth()
  @Roles(UserRoles.ROOT, UserRoles.ADMIN, UserRoles.ROOT_STAFF, UserRoles.STAFF)
  @Permissions(PermissionType.DELETE, 'surveys')
  @ResponseMessage(MESSAGE_CODES.DATA_DELETED.code)
  @ApiOperation({ summary: 'Delete survey' })
  @ApiResponse({ status: 200 })
  async remove(@Param('id') id: string) {
    this.logger.log(`[DELETE] Survey deletion request received for ID: ${id}`);
    try {
      await this.surveyService.remove(id);
      this.logger.log(`[DELETE] Survey deleted successfully: ${id}`);
      return { message: 'Survey deleted successfully' };
    } catch (error) {
      this.logger.error(`[DELETE] Failed to delete survey ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }
}
