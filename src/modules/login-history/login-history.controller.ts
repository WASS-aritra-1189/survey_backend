/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';
import {
  Controller,
  Get,
  Inject,
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
import { CurrentUser, ResponseMessage } from '../../core/decorators';
import { JwtAuthGuard } from '../../core/guards/jwt-auth.guard';
import { RolesGuard } from '../../core/guards/roles.guard';
import { Serialize } from '../../core/interceptors/serialize.interceptor';
import { type IUser } from '../../core/interfaces/user.interface';
import { UserRoles } from '../../shared/enums/accouts.enum';
import { EnquiryListResponseDto } from '../enquiry-list/dto/enquiry-list-response.dto';
import { QueryLoginHistoryDto } from './dto/query-login-history.dto';
import { LoginHistory } from './entities/login-history.entity';
import { ILoginHistoryService } from './interfaces/login-history-service.interface';

@ApiTags('Login History')
@Controller('login-history')
@UseGuards(JwtAuthGuard, RolesGuard)
export class LoginHistoryController {
  constructor(
    @Inject('ILoginHistoryService')
    private readonly loginHistoryService: ILoginHistoryService,
  ) {}

  @Get()
  @ResponseMessage('DATA_004')
  @Serialize(EnquiryListResponseDto)
  @UseInterceptors(CacheInterceptor)
  @CacheKey('enquiry_list_admin')
  @CacheTTL(120)
  @Throttle({ default: { limit: 50, ttl: 60000 } })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all enquiries' })
  @ApiResponse({ type: EnquiryListResponseDto })
  findAll(
    @Query() query: QueryLoginHistoryDto,
    @CurrentUser() user: IUser,
  ): Promise<{
    data: LoginHistory[];
    total: number;
    page: number;
    limit: number;
  }> {
    if (user.role === UserRoles.USER) {
      query.accountId = user.id;
    }
    return this.loginHistoryService.findAll(query);
  }
}
