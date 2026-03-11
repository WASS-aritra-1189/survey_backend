/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { DefaultStatus } from '../../../shared/enums/status.enum';
import { CreateSurveyDto } from '../dto/create-survey.dto';
import { QuerySurveyDto } from '../dto/query-survey.dto';
import { UpdateSurveyDto } from '../dto/update-survey.dto';
import { Survey } from '../entities/survey.entity';

export interface ISurveyService {
  create(dto: CreateSurveyDto, accountId: string): Promise<Survey>;
  findAll(query: QuerySurveyDto): Promise<{ data: Survey[]; total: number }>;
  findOne(id: string): Promise<Survey>;
  update(id: string, dto: UpdateSurveyDto, accountId: string): Promise<Survey>;
  updateStatus(id: string, status: DefaultStatus, accountId: string): Promise<Survey>;
  assignToSurveyMaster(id: string, surveyMasterId: string, accountId: string): Promise<Survey>;
  bulkAssignToSurveyMasters(id: string, surveyMasterIds: string[], accountId: string): Promise<Survey>;
  getAssignees(id: string): Promise<any[]>;
  remove(id: string): Promise<void>;
}
