/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { Controller, Get, Query, UseGuards, Param } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from '../../core/decorators/roles.decorator';
import { ResponseMessage } from '../../core/decorators/response-message.decorator';
import { RolesGuard } from '../../core/guards/roles.guard';
import { MESSAGE_CODES } from '../../shared/constants/message-codes';
import { UserRoles } from '../../shared/enums/accouts.enum';
import { ActivityLogsService } from './activity-logs.service';
import { QueryActivityLogDto } from './dto/query-activity-log.dto';

@ApiTags('activity-logs')
@Controller('activity-logs')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiBearerAuth()
export class ActivityLogsController {
  constructor(private readonly activityLogsService: ActivityLogsService) {}

  @Get()
  @Roles(UserRoles.ROOT, UserRoles.ADMIN, UserRoles.ROOT_STAFF, UserRoles.STAFF)
  @ResponseMessage(MESSAGE_CODES.DATA_RETRIEVED.code)
  @ApiOperation({ summary: 'Get activity logs with filters' })
  @ApiResponse({ status: 200 })
  async findAll(@Query() query: QueryActivityLogDto) {
    return await this.activityLogsService.findAll(query);
  }

  @Get('user/:userId')
  @Roles(UserRoles.ROOT, UserRoles.ADMIN, UserRoles.ROOT_STAFF)
  @ResponseMessage(MESSAGE_CODES.DATA_RETRIEVED.code)
  @ApiOperation({ summary: 'Get activity logs for a specific user' })
  @ApiResponse({ status: 200 })
  async findByUser(
    @Param('userId') userId: string,
    @Query() query: QueryActivityLogDto,
  ) {
    return await this.activityLogsService.findByUser(userId, query);
  }
}
