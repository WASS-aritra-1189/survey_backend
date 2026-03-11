/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { CreateSurveyMasterDto } from '../dto/create-survey-master.dto';
import { QuerySurveyMasterDto } from '../dto/query-survey-master.dto';
import { UpdateSurveyMasterDto } from '../dto/update-survey-master.dto';
import { SurveyMaster } from '../entities/survey-master.entity';
import { DefaultStatus } from '../../../shared/enums/status.enum';

export interface ISurveyMasterService {
  create(dto: CreateSurveyMasterDto, accountId: string): Promise<SurveyMaster>;
  findAll(query: QuerySurveyMasterDto): Promise<{ data: SurveyMaster[]; total: number }>;
  findOne(id: string): Promise<SurveyMaster>;
  update(id: string, dto: UpdateSurveyMasterDto, accountId: string): Promise<SurveyMaster>;
  updateStatus(id: string, status: DefaultStatus, accountId: string): Promise<SurveyMaster>;
  remove(id: string): Promise<void>;
  login(loginId: string, password: string): Promise<{ accessToken: string; surveyMaster: any }>;
  resetPassword(id: string, dto: { oldPassword: string; newPassword: string; confirmPassword: string }, accountId: string): Promise<void>;
}
