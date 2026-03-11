/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { MESSAGE_CODES } from '../../shared/constants/message-codes';
import { MessageType } from '../../shared/enums/message-type.enum';
import { DefaultStatus } from '../../shared/enums/status.enum';
import { CustomException } from '../../shared/exceptions/custom.exception';
import { ActivityLogsService } from '../activity-logs/activity-logs.service';
import { ActivityAction, ActivityModule } from '../activity-logs/entities/activity-log.entity';
import { ZonesService } from '../zones/zones.service';
import { CreateSurveyDto } from './dto/create-survey.dto';
import { QuerySurveyDto } from './dto/query-survey.dto';
import { UpdateSurveyDto } from './dto/update-survey.dto';
import { Survey } from './entities/survey.entity';
import { SurveyMaster } from '../survey-master/entities/survey-master.entity';
import { SurveyAssignmentLocation } from './entities/survey-assignment-location.entity';
import { ISurveyService } from './interfaces/survey-service.interface';
import { LocationConstraintDto } from './dto/assign-survey-master-with-location.dto';

@Injectable()
export class SurveyService implements ISurveyService {
  private readonly logger = new Logger(SurveyService.name);

  constructor(
    @InjectRepository(Survey)
    private readonly surveyRepository: Repository<Survey>,
    @InjectRepository(SurveyMaster)
    private readonly surveyMasterRepository: Repository<SurveyMaster>,
    @InjectRepository(SurveyAssignmentLocation)
    private readonly locationRepository: Repository<SurveyAssignmentLocation>,
    private readonly activityLogsService: ActivityLogsService,
    private readonly zonesService: ZonesService,
  ) {}

  async create(dto: CreateSurveyDto, accountId: string): Promise<Survey> {
    // Generate unique 4-digit token
    const accessToken = await this.generateUniqueToken();
    
    const survey = this.surveyRepository.create({
      title: dto.title,
      description: dto.description,
      questions: dto.questions.map(q => ({
        questionText: q.questionText,
        type: q.type,
        order: q.order,
        isRequired: q.isRequired,
        options: q.options?.map(o => ({
          optionText: o.optionText,
          order: o.order,
        })) || [],
      })),
      target: dto.target,
      deviceType: dto.deviceType,
      requiresLocationValidation: dto.requiresLocationValidation || false,
      allowAnonymousSubmission: dto.allowAnonymousSubmission || false,
      surveyTypeId: dto.surveyTypeId,
      accessToken,
      createdBy: accountId,
    });
    const saved = await this.surveyRepository.save(survey);
    
    const surveyId = Array.isArray(saved) ? saved[0]?.id : saved.id;
    const publicUrl = `https://survey-frontend-web.vercel.app/survey/${surveyId}`;
    
    await this.activityLogsService.log(
      accountId,
      ActivityModule.SURVEY,
      ActivityAction.CREATE,
      `Created survey: ${dto.title}`,
      surveyId,
    );
    
    const result = Array.isArray(saved) ? saved[0] : saved;
    return { ...result, publicUrl } as any;
  }

  private async generateUniqueToken(): Promise<string> {
    let token = '';
    let exists = true;
    
    while (exists) {
      token = Math.floor(1000 + Math.random() * 9000).toString();
      const existing = await this.surveyRepository.findOne({ where: { accessToken: token } });
      exists = !!existing;
    }
    
    return token;
  }

  async findAll(query: QuerySurveyDto): Promise<{ data: Survey[]; total: number }> {
    const { page = 1, limit = 10, search, status } = query;
    const qb = this.surveyRepository.createQueryBuilder('survey')
      .loadRelationCountAndMap('survey.totalResponses', 'survey.surveyResponses');

    if (search) {
      qb.andWhere('(survey.title ILIKE :search OR survey.description ILIKE :search)', {
        search: `%${search}%`,
      });
    }

    if (status) {
      qb.andWhere('survey.status = :status', { status });
    }

    qb.skip((page - 1) * limit).take(limit);
    qb.orderBy('survey.createdAt', 'DESC');

    const [data, total] = await qb.getManyAndCount();
    const frontendUrl = 'https://survey-frontend-web.vercel.app';
    const dataWithUrls = data.map(survey => ({ ...survey, publicUrl: `${frontendUrl}/survey/${survey.id}` })) as any;
    return { data: dataWithUrls, total };
  }

  async findAssignedSurveys(userId: string, query: QuerySurveyDto): Promise<{ data: Survey[]; total: number }> {
    const { page = 1, limit = 10, search, status } = query;
    const qb = this.surveyRepository.createQueryBuilder('survey')
      .loadRelationCountAndMap('survey.totalResponses', 'survey.surveyResponses')
      .where('survey.surveyMasterIds @> :userId', { userId: JSON.stringify([userId]) });

    if (search) {
      qb.andWhere('(survey.title ILIKE :search OR survey.description ILIKE :search)', {
        search: `%${search}%`,
      });
    }

    if (status) {
      qb.andWhere('survey.status = :status', { status });
    }

    qb.skip((page - 1) * limit).take(limit);
    qb.orderBy('survey.createdAt', 'DESC');

    const [data, total] = await qb.getManyAndCount();
    const frontendUrl = 'https://survey-frontend-web.vercel.app';
    const dataWithUrls = data.map(survey => ({ ...survey, publicUrl: `${frontendUrl}/survey/${survey.id}` })) as any;
    return { data: dataWithUrls, total };
  }

  async findOne(id: string): Promise<Survey> {
    const survey = await this.surveyRepository.createQueryBuilder('survey')
      .leftJoinAndSelect('survey.questions', 'questions')
      .leftJoinAndSelect('questions.options', 'options')
      .loadRelationCountAndMap('survey.totalResponses', 'survey.surveyResponses')
      .where('survey.id = :id', { id })
      .orderBy('questions.order', 'ASC')
      .addOrderBy('options.order', 'ASC')
      .getOne();
    if (!survey) {
      throw new CustomException(MESSAGE_CODES.NOT_FOUND, MessageType.ERROR);
    }
    return survey;
  }

  async getQuestions(id: string) {
    const survey = await this.surveyRepository.createQueryBuilder('survey')
      .leftJoinAndSelect('survey.questions', 'questions')
      .leftJoinAndSelect('questions.options', 'options')
      .where('survey.id = :id', { id })
      .orderBy('questions.order', 'ASC')
      .addOrderBy('options.order', 'ASC')
      .getOne();
    if (!survey) {
      throw new CustomException(MESSAGE_CODES.NOT_FOUND, MessageType.ERROR);
    }
    return { data: survey.questions, total: survey.questions?.length || 0 };
  }

  async findOneForSurveyMaster(id: string, userId: string): Promise<Survey> {
    const survey = await this.surveyRepository.createQueryBuilder('survey')
      .loadRelationCountAndMap('survey.totalResponses', 'survey.surveyResponses')
      .where('survey.id = :id', { id })
      .andWhere('survey.surveyMasterIds @> :userId', { userId: JSON.stringify([userId]) })
      .getOne();
    if (!survey) {
      throw new CustomException(MESSAGE_CODES.NOT_FOUND, MessageType.ERROR);
    }
    return survey;
  }

  async update(id: string, dto: UpdateSurveyDto, accountId: string): Promise<Survey> {
    const survey = await this.findOne(id);
    if (dto.title !== undefined) survey.title = dto.title;
    if (dto.description !== undefined) survey.description = dto.description;
    if (dto.target !== undefined) survey.target = dto.target;
    if (dto.requiresLocationValidation !== undefined) survey.requiresLocationValidation = dto.requiresLocationValidation;
    if (dto.allowAnonymousSubmission !== undefined) survey.allowAnonymousSubmission = dto.allowAnonymousSubmission;
    if (dto.surveyTypeId !== undefined) survey.surveyTypeId = dto.surveyTypeId;
    
    if (dto.questions !== undefined) {
      await this.surveyRepository.manager.query(
        `DELETE FROM question_options WHERE "questionId" IN (SELECT id FROM questions WHERE "surveyId" = $1)`,
        [id]
      );
      await this.surveyRepository.manager.query(
        `DELETE FROM questions WHERE "surveyId" = $1`,
        [id]
      );
      
      survey.questions = dto.questions.map(q => ({
        questionText: q.questionText,
        type: q.type,
        order: q.order,
        isRequired: q.isRequired,
        surveyId: id,
        options: q.options?.map(o => ({
          optionText: o.optionText,
          order: o.order,
        })) || [],
      })) as any;
    }
    
    survey.updatedBy = accountId;
    const updated = await this.surveyRepository.save(survey);
    await this.activityLogsService.log(
      accountId,
      ActivityModule.SURVEY,
      ActivityAction.UPDATE,
      `Updated survey: ${survey.title}`,
      id,
    );
    return updated;
  }

  async updateStatus(id: string, status: DefaultStatus, accountId: string): Promise<Survey> {
    const survey = await this.findOne(id);
    survey.status = status;
    survey.updatedBy = accountId;
    return await this.surveyRepository.save(survey);
  }

  async assignToSurveyMaster(id: string, surveyMasterId: string, accountId: string): Promise<Survey> {
    const survey = await this.findOne(id);
    
    // Check if survey is active
    if (survey.status !== DefaultStatus.ACTIVE) {
      throw new CustomException(MESSAGE_CODES.SURVEY_INACTIVE, MessageType.ERROR);
    }
    
    // Check survey master exists and get their limit
    const surveyMaster = await this.surveyMasterRepository.findOne({ where: { id: surveyMasterId } });
    if (!surveyMaster) {
      throw new CustomException(MESSAGE_CODES.NOT_FOUND, MessageType.ERROR);
    }
    
    // Check if survey master is active
    if (surveyMaster.status !== DefaultStatus.ACTIVE) {
      throw new CustomException(MESSAGE_CODES.SURVEY_MASTER_INACTIVE, MessageType.ERROR);
    }
    
    // Initialize array if null
    if (!survey.surveyMasterIds) {
      survey.surveyMasterIds = [];
    }
    
    // Check if already assigned
    if (survey.surveyMasterIds.includes(surveyMasterId)) {
      survey.updatedBy = accountId;
      return await this.surveyRepository.save(survey);
    }
    
    // Count current surveys assigned to this master using JSONB contains
    const currentCount = await this.surveyRepository
      .createQueryBuilder('survey')
      .where('survey.surveyMasterIds @> :masterId', { masterId: JSON.stringify([surveyMasterId]) })
      .getCount();
    
    // Check if adding this survey would exceed the limit (0 means no surveys allowed)
    if (currentCount >= surveyMaster.surveyLimit) {
      throw new CustomException(MESSAGE_CODES.SURVEY_LIMIT_EXCEEDED, MessageType.ERROR);
    }
    
    survey.surveyMasterIds.push(surveyMasterId);
    survey.updatedBy = accountId;
    return await this.surveyRepository.save(survey);
  }

  async bulkAssignToSurveyMasters(id: string, surveyMasterIds: string[], accountId: string): Promise<Survey> {
    const survey = await this.findOne(id);
    
    // Check if survey is active
    if (survey.status !== DefaultStatus.ACTIVE) {
      throw new CustomException(MESSAGE_CODES.SURVEY_INACTIVE, MessageType.ERROR);
    }
    
    if (!survey.surveyMasterIds) {
      survey.surveyMasterIds = [];
    }
    
    const errors: string[] = [];
    
    for (const masterId of surveyMasterIds) {
      // Skip if already assigned
      if (survey.surveyMasterIds.includes(masterId)) {
        continue;
      }
      
      // Check survey master exists and get their limit
      const surveyMaster = await this.surveyMasterRepository.findOne({ where: { id: masterId } });
      if (!surveyMaster) {
        errors.push(`Survey master ${masterId} not found`);
        continue;
      }
      
      // Check if survey master is active
      if (surveyMaster.status !== DefaultStatus.ACTIVE) {
        errors.push(`Survey master ${surveyMaster.loginId} is not active`);
        continue;
      }
      
      // Count current surveys assigned to this master using JSONB contains
      const currentCount = await this.surveyRepository
        .createQueryBuilder('survey')
        .where('survey.surveyMasterIds @> :masterId', { masterId: JSON.stringify([masterId]) })
        .getCount();
      
      // Check if adding this survey would exceed the limit
      if (currentCount >= surveyMaster.surveyLimit) {
        errors.push(`Survey master ${surveyMaster.loginId} has reached their limit of ${surveyMaster.surveyLimit} surveys`);
        continue;
      }
      
      survey.surveyMasterIds.push(masterId);
    }
    
    if (errors.length > 0 && survey.surveyMasterIds.length === 0) {
      throw new CustomException(MESSAGE_CODES.BULK_ASSIGN_FAILED, MessageType.ERROR);
    }
    
    survey.updatedBy = accountId;
    return await this.surveyRepository.save(survey);
  }

  async getAssignees(id: string): Promise<any[]> {
    const survey = await this.findOne(id);
    if (!survey.surveyMasterIds || survey.surveyMasterIds.length === 0) {
      return [];
    }
    return await this.surveyMasterRepository.find({
      where: { id: In(survey.surveyMasterIds) },
    });
  }

  async unassignFromSurveyMaster(id: string, surveyMasterId: string, accountId: string): Promise<Survey> {
    const survey = await this.findOne(id);
    
    if (!survey.surveyMasterIds || !survey.surveyMasterIds.includes(surveyMasterId)) {
      throw new CustomException(MESSAGE_CODES.SURVEY_NOT_ASSIGNED, MessageType.ERROR);
    }
    
    survey.surveyMasterIds = survey.surveyMasterIds.filter(id => id !== surveyMasterId);
    survey.updatedBy = accountId;
    return await this.surveyRepository.save(survey);
  }

  async remove(id: string): Promise<void> {
    this.logger.log(`[REMOVE] Starting deletion process for survey ID: ${id}`);
    
    try {
      this.logger.log(`[REMOVE] Fetching survey with ID: ${id}`);
      const survey = await this.findOne(id);
      this.logger.log(`[REMOVE] Survey found: ${survey.title} (ID: ${survey.id})`);
      
      this.logger.log(`[REMOVE] Deleting associated survey responses`);
      await this.surveyRepository.manager.query(
        `DELETE FROM survey_responses WHERE "surveyId" = $1`,
        [id]
      );
      this.logger.log(`[REMOVE] Survey responses deleted`);
      
      this.logger.log(`[REMOVE] Attempting to remove survey from database`);
      await this.surveyRepository.remove(survey);
      this.logger.log(`[REMOVE] Survey removed from database successfully`);
      
      this.logger.log(`[REMOVE] Logging activity for survey deletion`);
      await this.activityLogsService.log(
        survey.createdBy,
        ActivityModule.SURVEY,
        ActivityAction.DELETE,
        `Deleted survey: ${survey.title}`,
        id,
      );
      this.logger.log(`[REMOVE] Activity logged successfully`);
      this.logger.log(`[REMOVE] Survey deletion completed successfully for ID: ${id}`);
    } catch (error) {
      this.logger.error(`[REMOVE] Error during survey deletion for ID ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async assignWithLocation(id: string, surveyMasterId: string, locationConstraint: LocationConstraintDto | undefined, accountId: string): Promise<Survey> {
    const survey = await this.findOne(id);
    
    if (survey.requiresLocationValidation && !locationConstraint) {
      throw new CustomException(
        { code: 'LOCATION_001', message: 'Location constraint is required for this survey' },
        MessageType.ERROR,
      );
    }
    
    const assignedSurvey = await this.assignToSurveyMaster(id, surveyMasterId, accountId);
    
    if (locationConstraint) {
      await this.saveLocationConstraint(id, surveyMasterId, locationConstraint, accountId);
    }
    
    return assignedSurvey;
  }

  async saveLocationConstraint(surveyId: string, surveyMasterId: string, constraint: LocationConstraintDto, accountId: string): Promise<SurveyAssignmentLocation> {
    const existing = await this.locationRepository.findOne({ where: { surveyId, surveyMasterId } });

    let latitude: number, longitude: number, radiusInMeters: number, zoneId: string | null = null;

    if (constraint.zoneId) {
      const zone = await this.zonesService.findOne(constraint.zoneId);
      if (!zone) {
        throw new CustomException({ code: 'ZONE_001', message: 'Zone not found' }, MessageType.ERROR);
      }
      latitude = Number(zone.latitude);
      longitude = Number(zone.longitude);
      radiusInMeters = zone.radiusInMeters;
      zoneId = zone.id;
    } else {
      if (!constraint.latitude || !constraint.longitude || !constraint.radiusInMeters) {
        throw new CustomException({ code: 'LOCATION_004', message: 'Either zoneId or lat/long/radius required' }, MessageType.ERROR);
      }
      latitude = constraint.latitude;
      longitude = constraint.longitude;
      radiusInMeters = constraint.radiusInMeters;
    }

    if (existing) {
      existing.latitude = latitude;
      existing.longitude = longitude;
      existing.radiusInMeters = radiusInMeters;
      existing.zoneId = zoneId;
      existing.updatedBy = accountId;
      return await this.locationRepository.save(existing);
    }

    const location = this.locationRepository.create({
      surveyId,
      surveyMasterId,
      latitude,
      longitude,
      radiusInMeters,
      zoneId,
      createdBy: accountId,
    });

    return await this.locationRepository.save(location);
  }

  async getLocationConstraint(surveyId: string, surveyMasterId: string): Promise<SurveyAssignmentLocation | null> {
    return await this.locationRepository.findOne({
      where: { surveyId, surveyMasterId, isActive: true },
    });
  }

  async updateLocationConstraint(surveyId: string, surveyMasterId: string, constraint: LocationConstraintDto, accountId: string): Promise<SurveyAssignmentLocation> {
    return await this.saveLocationConstraint(surveyId, surveyMasterId, constraint, accountId);
  }

  async removeLocationConstraint(surveyId: string, surveyMasterId: string): Promise<void> {
    await this.locationRepository.delete({ surveyId, surveyMasterId });
  }
}
