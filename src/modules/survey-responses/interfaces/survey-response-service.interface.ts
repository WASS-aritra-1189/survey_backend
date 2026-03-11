/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import type { MultipartFile } from '@fastify/multipart';
import type { PaginatedResult } from '../../../core/interfaces/paginated-result.interface';
import type { CreateAudioResponseDto } from '../dto/create-audio-response.dto';
import type { CreateSurveyResponseDto } from '../dto/create-survey-response.dto';
import type { CreateMasterSurveyResponseDto } from '../dto/create-master-survey-response.dto';
import type { QuerySurveyResponseDto } from '../dto/query-survey-response.dto';
import type { UpdateSurveyResponseDto } from '../dto/update-survey-response.dto';
import type { SurveyResponse } from '../entities/survey-response.entity';

export interface ISurveyResponseService {
  create(createDto: CreateSurveyResponseDto, surveyMasterId: string): Promise<SurveyResponse>;
  createAnonymous(createDto: CreateSurveyResponseDto): Promise<SurveyResponse>;
  createByMaster(createDto: CreateMasterSurveyResponseDto, surveyMasterId: string): Promise<SurveyResponse>;
  createByMasterToken(createDto: CreateMasterSurveyResponseDto): Promise<SurveyResponse>;
  createWithAudio(req: any, surveyMasterId: string): Promise<SurveyResponse>;
  findAll(query: QuerySurveyResponseDto, userId?: string, userRole?: string): Promise<PaginatedResult<SurveyResponse>>;
  findOne(id: string): Promise<SurveyResponse>;
  update(id: string, updateDto: UpdateSurveyResponseDto, surveyMasterId: string): Promise<SurveyResponse>;
  remove(id: string, surveyMasterId: string): Promise<void>;
  getStats(surveyId: string): Promise<any>;
  getCrosstab(surveyId: string, questionId: string): Promise<any>;
  uploadAudioResponse(dto: CreateAudioResponseDto, file: MultipartFile, surveyMasterId: string): Promise<{ success: boolean; audioUrl: string }>;
  addAudioToResponse(responseId: string, file: MultipartFile, surveyMasterId: string): Promise<{ success: boolean; audioUrl: string }>;
}
