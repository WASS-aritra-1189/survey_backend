/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from '../../core/decorators/roles.decorator';
import { ResponseMessage } from '../../core/decorators/response-message.decorator';
import { RolesGuard } from '../../core/guards/roles.guard';
import { MESSAGE_CODES } from '../../shared/constants/message-codes';
import { UserRoles } from '../../shared/enums/accouts.enum';
import { ReportsQueryDto } from './dto/reports-query.dto';
import { ReportsService } from './reports.service';

@ApiTags('reports')
@Controller('reports')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiBearerAuth()
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('overall')
  @Roles(UserRoles.ROOT, UserRoles.ADMIN, UserRoles.ROOT_STAFF, UserRoles.STAFF)
  @ResponseMessage(MESSAGE_CODES.DATA_RETRIEVED.code)
  @ApiOperation({ summary: 'Get overall statistics - total surveys and responses' })
  @ApiResponse({ status: 200 })
  async getOverallStats(@Query() query: ReportsQueryDto) {
    return await this.reportsService.getOverallStats(query.year, query.month);
  }

  @Get('weekly-responses')
  @Roles(UserRoles.ROOT, UserRoles.ADMIN, UserRoles.ROOT_STAFF, UserRoles.STAFF)
  @ResponseMessage(MESSAGE_CODES.DATA_RETRIEVED.code)
  @ApiOperation({ summary: 'Get weekly response data' })
  @ApiResponse({ status: 200 })
  async getWeeklyResponses() {
    return await this.reportsService.getWeeklyResponses();
  }

  @Get('top-surveys')
  @Roles(UserRoles.ROOT, UserRoles.ADMIN, UserRoles.ROOT_STAFF, UserRoles.STAFF)
  @ResponseMessage(MESSAGE_CODES.DATA_RETRIEVED.code)
  @ApiOperation({ summary: 'Get top performing surveys' })
  @ApiResponse({ status: 200 })
  async getTopSurveys() {
    return await this.reportsService.getTopSurveys();
  }

  @Get('user-activity')
  @Roles(UserRoles.ROOT, UserRoles.ADMIN, UserRoles.ROOT_STAFF, UserRoles.STAFF)
  @ResponseMessage(MESSAGE_CODES.DATA_RETRIEVED.code)
  @ApiOperation({ summary: 'Get user activity analytics' })
  @ApiResponse({ status: 200 })
  async getUserActivity() {
    return await this.reportsService.getUserActivity();
  }
}
