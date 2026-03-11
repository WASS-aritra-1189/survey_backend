/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { MESSAGE_CODES } from '../../shared/constants/message-codes';
import { MessageType } from '../../shared/enums/message-type.enum';
import { DefaultStatus } from '../../shared/enums/status.enum';
import { CustomException } from '../../shared/exceptions/custom.exception';
import { ActivityLogsService } from '../activity-logs/activity-logs.service';
import { ActivityAction, ActivityModule } from '../activity-logs/entities/activity-log.entity';
import { CreateSurveyMasterDto } from './dto/create-survey-master.dto';
import { QuerySurveyMasterDto } from './dto/query-survey-master.dto';
import { UpdateSurveyMasterDto } from './dto/update-survey-master.dto';
import { SurveyMaster } from './entities/survey-master.entity';
import { ISurveyMasterService } from './interfaces/survey-master-service.interface';

@Injectable()
export class SurveyMasterService implements ISurveyMasterService {
  constructor(
    @InjectRepository(SurveyMaster)
    private readonly surveyMasterRepository: Repository<SurveyMaster>,
    private readonly jwtService: JwtService,
    private readonly activityLogsService: ActivityLogsService,
  ) {}

  async create(dto: CreateSurveyMasterDto, accountId: string): Promise<SurveyMaster> {
    const existing = await this.surveyMasterRepository.findOne({ where: { loginId: dto.loginId } });
    if (existing) {
      throw new CustomException(MESSAGE_CODES.USER_ALREADY_EXISTS, MessageType.ERROR);
    }
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    
    // Generate unique 4-digit token
    const accessToken = await this.generateUniqueToken();
    
    const surveyMaster = this.surveyMasterRepository.create({
      loginId: dto.loginId,
      password: hashedPassword,
      surveyLimit: dto.surveyLimit,
      settingId: dto.settingId,
      accessToken,
      accountId,
      createdBy: accountId,
    });
    const saved = await this.surveyMasterRepository.save(surveyMaster);
    await this.activityLogsService.log(
      accountId,
      ActivityModule.SURVEY_MASTER,
      ActivityAction.CREATE,
      `Created survey master: ${dto.loginId}`,
      saved.id,
    );
    return saved;
  }

  private async generateUniqueToken(): Promise<string> {
    let token = '';
    let exists = true;
    
    while (exists) {
      token = Math.floor(1000 + Math.random() * 9000).toString();
      const existing = await this.surveyMasterRepository.findOne({ where: { accessToken: token } });
      exists = !!existing;
    }
    
    return token;
  }

  async findAll(query: QuerySurveyMasterDto): Promise<{ data: any[]; total: number }> {
    const { page = 1, limit = 10, status, accountId } = query;
    const qb = this.surveyMasterRepository.createQueryBuilder('survey');

    if (status) {
      qb.andWhere('survey.status = :status', { status });
    }
    if (accountId) {
      qb.andWhere('survey.accountId = :accountId', { accountId });
    }

    qb.skip((page - 1) * limit).take(limit);
    qb.orderBy('survey.createdAt', 'DESC');

    const [data, total] = await qb.getManyAndCount();

    const enrichedData = await Promise.all(
      data.map(async (master) => {
        const surveysAssigned = await this.surveyMasterRepository.query(
          `SELECT COUNT(*) as count FROM surveys WHERE "surveyMasterIds"::jsonb @> $1::jsonb`,
          [JSON.stringify([master.id])]
        );
        const responsesGiven = await this.surveyMasterRepository.query(
          `SELECT COUNT(*) as count FROM survey_responses WHERE "surveyMasterId" = $1`,
          [master.id]
        );
        return {
          ...master,
          totalSurveysAssigned: parseInt(surveysAssigned[0]?.count || '0'),
          totalResponsesGiven: parseInt(responsesGiven[0]?.count || '0'),
        };
      })
    );

    return { data: enrichedData, total };
  }

  async findOne(id: string): Promise<SurveyMaster> {
    const surveyMaster = await this.surveyMasterRepository.findOne({ where: { id } });
    if (!surveyMaster) {
      throw new CustomException(MESSAGE_CODES.NOT_FOUND, MessageType.ERROR);
    }
    return surveyMaster;
  }

  async update(id: string, dto: UpdateSurveyMasterDto, accountId: string): Promise<SurveyMaster> {
    const surveyMaster = await this.findOne(id);
    Object.assign(surveyMaster, dto, { updatedBy: accountId });
    const updated = await this.surveyMasterRepository.save(surveyMaster);
    await this.activityLogsService.log(
      accountId,
      ActivityModule.SURVEY_MASTER,
      ActivityAction.UPDATE,
      `Updated survey master: ${surveyMaster.loginId}`,
      id,
    );
    return updated;
  }

  async updateStatus(id: string, status: DefaultStatus, accountId: string): Promise<SurveyMaster> {
    const surveyMaster = await this.findOne(id);
    surveyMaster.status = status;
    surveyMaster.updatedBy = accountId;
    return await this.surveyMasterRepository.save(surveyMaster);
  }

  async remove(id: string): Promise<void> {
    const surveyMaster = await this.findOne(id);
    await this.surveyMasterRepository.remove(surveyMaster);
    await this.activityLogsService.log(
      surveyMaster.createdBy,
      ActivityModule.SURVEY_MASTER,
      ActivityAction.DELETE,
      `Deleted survey master: ${surveyMaster.loginId}`,
      id,
    );
  }

  async login(loginId: string, password: string): Promise<{ accessToken: string; surveyMaster: any }> {
    const surveyMaster = await this.surveyMasterRepository.findOne({ where: { loginId } });
    if (!surveyMaster) {
      throw new CustomException(MESSAGE_CODES.AUTH_INVALID_CREDENTIALS, MessageType.ERROR);
    }
    if (surveyMaster.status !== DefaultStatus.ACTIVE) {
      throw new CustomException(MESSAGE_CODES.AUTH_ACCOUNT_INACTIVE, MessageType.ERROR);
    }
    const isPasswordValid = await bcrypt.compare(password, surveyMaster.password);
    if (!isPasswordValid) {
      throw new CustomException(MESSAGE_CODES.AUTH_INVALID_CREDENTIALS, MessageType.ERROR);
    }
    const payload = { sub: surveyMaster.id, loginId: surveyMaster.loginId, type: 'SURVEY_MASTER' };
    const accessToken = this.jwtService.sign(payload);
    const { password: _, ...surveyMasterData } = surveyMaster;
    return { accessToken, surveyMaster: surveyMasterData };
  }

  async resetPassword(id: string, dto: { oldPassword: string; newPassword: string; confirmPassword: string }, accountId: string): Promise<void> {
    const surveyMaster = await this.findOne(id);
    const isPasswordValid = await bcrypt.compare(dto.oldPassword, surveyMaster.password);
    if (!isPasswordValid) {
      throw new CustomException(MESSAGE_CODES.AUTH_INVALID_CREDENTIALS, MessageType.ERROR);
    }
    if (dto.newPassword !== dto.confirmPassword) {
      throw new CustomException(MESSAGE_CODES.AUTH_INVALID_CREDENTIALS, MessageType.ERROR);
    }
    surveyMaster.password = await bcrypt.hash(dto.newPassword, 10);
    surveyMaster.updatedBy = accountId;
    await this.surveyMasterRepository.save(surveyMaster);
    await this.activityLogsService.log(
      accountId,
      ActivityModule.SURVEY_MASTER,
      ActivityAction.UPDATE,
      `Reset password for survey master: ${surveyMaster.loginId}`,
      id,
    );
  }
}
