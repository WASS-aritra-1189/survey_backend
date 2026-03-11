/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import type { MultipartFile } from '@fastify/multipart';
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
  Req,
  UseGuards,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import type { FastifyRequest } from 'fastify';
import { CurrentUser } from '../../core/decorators/current-user.decorator';
import { Public } from '../../core/decorators/public.decorator';
import { ResponseMessage } from '../../core/decorators/response-message.decorator';
import { JwtAuthGuard } from '../../core/guards/jwt-auth.guard';
import { Serialize } from '../../core/interceptors/serialize.interceptor';
import type { IUser } from '../../core/interfaces/user.interface';
import { CreateAudioResponseDto } from './dto/create-audio-response.dto';
import { CreateSurveyResponseDto } from './dto/create-survey-response.dto';
import { CreateMasterSurveyResponseDto } from './dto/create-master-survey-response.dto';
import { QuerySurveyResponseDto } from './dto/query-survey-response.dto';
import { UpdateSurveyResponseDto } from './dto/update-survey-response.dto';
import {
  SurveyResponseListResponseDto,
  SurveyResponseResponseDto,
} from './dto/survey-response-response.dto';
import { SurveyResponse } from './entities/survey-response.entity';
import type { ISurveyResponseService } from './interfaces/survey-response-service.interface';

interface FastifyRequestWithMultipart extends FastifyRequest {
  file(): Promise<MultipartFile | undefined>;
}

@ApiTags('Survey Responses')
@Controller('survey-responses')
@UseGuards(JwtAuthGuard)
export class SurveyResponsesController {
  constructor(
    @Inject('ISurveyResponseService')
    private readonly surveyResponseService: ISurveyResponseService,
  ) {}

  @Post('audio')
  @ResponseMessage('DATA_001')
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Upload audio response for a survey question' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        surveyId: { type: 'string', format: 'uuid' },
        responseId: { type: 'string', format: 'uuid' },
        questionId: { type: 'string', format: 'uuid' },
        accessToken: { type: 'string' },
        audio: { type: 'string', format: 'binary' },
      },
    },
  })
  async uploadAudioResponse(
    @Req() req: FastifyRequestWithMultipart,
    @CurrentUser() user: any,
  ): Promise<{ success: boolean; audioUrl: string }> {
    const userId = user.sub || user.id;
    const file = await req.file();
    
    if (!file) {
      throw new BadRequestException('No audio file provided');
    }

    const fields = file.fields as any;
    const dto: CreateAudioResponseDto = {
      surveyId: fields.surveyId?.value,
      responseId: fields.responseId?.value,
      questionId: fields.questionId?.value,
      accessToken: fields.accessToken?.value,
    };

    return this.surveyResponseService.uploadAudioResponse(dto, file, userId);
  }

  @Post('master')
  @Public()
  @ResponseMessage('DATA_001')
  @Serialize(SurveyResponseResponseDto)
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  @ApiOperation({ summary: 'Submit anonymous survey response (No JWT required)' })
  @ApiResponse({ type: SurveyResponseResponseDto })
  createByMasterToken(
    @Body() createDto: CreateSurveyResponseDto,
  ): Promise<SurveyResponse> {
    return this.surveyResponseService.createAnonymous(createDto);
  }

  @Post()
  @ResponseMessage('DATA_001')
  @Serialize(SurveyResponseResponseDto)
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Submit survey response (Survey Master only)' })
  @ApiResponse({ type: SurveyResponseResponseDto })
  create(
    @Body() createDto: CreateSurveyResponseDto,
    @CurrentUser() user: any,
  ): Promise<SurveyResponse> {
    const userId = user.sub || user.id;
    createDto.createdBy = userId;
    return this.surveyResponseService.create(createDto, userId);
  }

  @Get('crosstab')
  @ResponseMessage('DATA_004')
  @Throttle({ default: { limit: 50, ttl: 60000 } })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get crosstab analysis for one question against all others' })
  @ApiResponse({ status: 200, description: 'Crosstab data retrieved successfully' })
  getCrosstab(@Query() query: any): Promise<any> {
    return this.surveyResponseService.getCrosstab(query.surveyId, query.questionId);
  }

  @Get('stats/:surveyId')
  @ResponseMessage('DATA_004')
  @Throttle({ default: { limit: 50, ttl: 60000 } })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get survey response statistics' })
  @ApiResponse({ status: 200, description: 'Survey statistics retrieved successfully' })
  getStats(@Param('surveyId') surveyId: string): Promise<any> {
    return this.surveyResponseService.getStats(surveyId);
  }

  @Get()
  @ResponseMessage('DATA_004')
  @Serialize(SurveyResponseListResponseDto)
  @UseInterceptors(CacheInterceptor)
  @CacheKey('survey_responses_list')
  @CacheTTL(120)
  @Throttle({ default: { limit: 50, ttl: 60000 } })
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Get all survey responses',
    description: 'Filter responses by surveyId, surveyMasterId, surveyMasterIds (comma-separated), respondentName, respondentContact, startDate, endDate'
  })
  @ApiResponse({ type: SurveyResponseListResponseDto })
  findAll(
    @Query() query: QuerySurveyResponseDto,
    @CurrentUser() user: any,
  ): Promise<{
    data: SurveyResponse[];
    total: number;
    page: number;
    limit: number;
  }> {
    const userId = user.sub || user.id;
    const userRole = user.roles || user.role;
    
    // Only filter by surveyMasterId if user is SURVEY_MASTER role
    if (userRole === 'SURVEY_MASTER') {
      query.surveyMasterId = userId;
    }
    return this.surveyResponseService.findAll(query, userId, userRole);
  }

  @Get(':id')
  @ResponseMessage('DATA_004')
  @Serialize(SurveyResponseResponseDto)
  @Throttle({ default: { limit: 50, ttl: 60000 } })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get survey response by ID' })
  @ApiResponse({ type: SurveyResponseResponseDto })
  findOne(@Param('id') id: string): Promise<SurveyResponse> {
    return this.surveyResponseService.findOne(id);
  }

  @Patch(':id/audio')
  @ResponseMessage('DATA_002')
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add audio to survey response' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        audio: { type: 'string', format: 'binary' },
      },
    },
  })
  async addAudio(
    @Param('id') id: string,
    @Req() req: FastifyRequestWithMultipart,
    @CurrentUser() user: any,
  ): Promise<{ success: boolean; audioUrl: string }> {
    const userId = user.sub || user.id;
    const file = await req.file();
    
    if (!file) {
      throw new BadRequestException('No audio file provided');
    }

    return this.surveyResponseService.addAudioToResponse(id, file, userId);
  }

  @Patch(':id')
  @ResponseMessage('DATA_002')
  @Serialize(SurveyResponseResponseDto)
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update survey response (Survey Master only)' })
  @ApiResponse({ type: SurveyResponseResponseDto })
  update(
    @Param('id') id: string,
    @Body() updateDto: UpdateSurveyResponseDto,
    @CurrentUser() user: any,
  ): Promise<SurveyResponse> {
    const userId = user.sub || user.id;
    updateDto.updatedBy = userId;
    return this.surveyResponseService.update(id, updateDto, userId);
  }

  @Delete(':id')
  @ResponseMessage('DATA_003')
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete survey response (Survey Master only)' })
  @ApiResponse({ status: 200, description: 'Response deleted successfully' })
  remove(@Param('id') id: string, @CurrentUser() user: any): Promise<void> {
    const userId = user.sub || user.id;
    return this.surveyResponseService.remove(id, userId);
  }
}
