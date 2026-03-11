/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import type { MultipartFile } from '@fastify/multipart';
import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { promises as fs } from 'fs';
import { join } from 'path';
import type { PaginatedResult } from '../../core/interfaces/paginated-result.interface';
import { CacheService } from '../../core/services/cache.service';
import {
  QueryBuilderService,
  type QueryConfig,
} from '../../core/services/query-builder.service';
import { MESSAGE_CODES } from '../../shared/constants/message-codes';
import { MessageType } from '../../shared/enums/message-type.enum';
import { CustomException } from '../../shared/exceptions/custom.exception';
import { Survey } from '../surveys/entities/survey.entity';
import { SurveyMaster } from '../survey-master/entities/survey-master.entity';
import { SurveyAssignmentLocation } from '../surveys/entities/survey-assignment-location.entity';
import { CreateAudioResponseDto } from './dto/create-audio-response.dto';
import { CreateSurveyResponseDto } from './dto/create-survey-response.dto';
import { CreateMasterSurveyResponseDto } from './dto/create-master-survey-response.dto';
import { QuerySurveyResponseDto } from './dto/query-survey-response.dto';
import { UpdateSurveyResponseDto } from './dto/update-survey-response.dto';
import { SurveyResponse } from './entities/survey-response.entity';
import type { ISurveyResponseService } from './interfaces/survey-response-service.interface';

@Injectable()
export class SurveyResponseService implements ISurveyResponseService {
  private readonly queryConfig: QueryConfig<SurveyResponse> = {
    alias: 'surveyResponse',
    searchFields: ['respondentName', 'respondentContact'],
    sortableFields: ['createdAt', 'updatedAt'],
    defaultSortField: 'createdAt',
    customFilters: (qb, query: QuerySurveyResponseDto) => {
      if (query.surveyId) {
        qb.andWhere('surveyResponse.surveyId = :surveyId', { surveyId: query.surveyId });
      }
      if (query.surveyMasterId) {
        qb.andWhere('surveyResponse.surveyMasterId = :surveyMasterId', { surveyMasterId: query.surveyMasterId });
      }
      if (query.surveyMasterIds && query.surveyMasterIds.length > 0) {
        qb.andWhere('surveyResponse.surveyMasterId IN (:...surveyMasterIds)', { surveyMasterIds: query.surveyMasterIds });
      }
      if (query.respondentName) {
        qb.andWhere('surveyResponse.respondentName ILIKE :respondentName', { respondentName: `%${query.respondentName}%` });
      }
      if (query.respondentContact) {
        qb.andWhere('surveyResponse.respondentContact ILIKE :respondentContact', { respondentContact: `%${query.respondentContact}%` });
      }
      if ((query as any).assignedSurveyIds && (query as any).assignedSurveyIds.length > 0) {
        qb.andWhere('surveyResponse.surveyId IN (:...assignedSurveyIds)', { assignedSurveyIds: (query as any).assignedSurveyIds });
      }
      if (query.startDate) {
        qb.andWhere('surveyResponse.createdAt >= :startDate', { startDate: new Date(query.startDate) });
      }
      if (query.endDate) {
        const endDate = new Date(query.endDate);
        endDate.setHours(23, 59, 59, 999);
        qb.andWhere('surveyResponse.createdAt <= :endDate', { endDate });
      }
    },
  };

  constructor(
    @InjectRepository(SurveyResponse)
    private readonly surveyResponseRepository: Repository<SurveyResponse>,
    @InjectRepository(Survey)
    private readonly surveyRepository: Repository<Survey>,
    @InjectRepository(SurveyMaster)
    private readonly surveyMasterRepository: Repository<SurveyMaster>,
    @InjectRepository(SurveyAssignmentLocation)
    private readonly locationRepository: Repository<SurveyAssignmentLocation>,
    private readonly cacheService: CacheService,
    private readonly queryBuilderService: QueryBuilderService,
  ) {}

  async addAudioToResponse(
    responseId: string,
    file: MultipartFile,
    surveyMasterId: string,
  ): Promise<{ success: boolean; audioUrl: string }> {
    console.log('addAudioToResponse called:', { responseId, surveyMasterId, mimetype: file.mimetype });
    
    const response = await this.surveyResponseRepository.findOne({
      where: { id: responseId, surveyMasterId },
    });

    console.log('Response found:', !!response);

    if (!response) {
      throw new CustomException(
        MESSAGE_CODES.NOT_FOUND,
        MessageType.ERROR,
        HttpStatus.NOT_FOUND,
      );
    }

    // Validate audio file
    const allowedTypes = ['audio/webm', 'audio/wav', 'audio/mp3', 'audio/mpeg', 'audio/ogg'];
    console.log('File mimetype:', file.mimetype, 'Allowed:', allowedTypes.includes(file.mimetype));
    
    if (!allowedTypes.includes(file.mimetype)) {
      throw new CustomException(
        { code: 'FILE_001', message: `Invalid audio file type: ${file.mimetype}` },
        MessageType.ERROR,
        HttpStatus.BAD_REQUEST,
      );
    }

    const buffer = await file.toBuffer();
    console.log('Buffer size:', buffer.length);
    
    const maxSize = 10 * 1024 * 1024;
    if (buffer.length > maxSize) {
      throw new CustomException(
        { code: 'FILE_002', message: 'Audio file exceeds 10MB' },
        MessageType.ERROR,
        HttpStatus.BAD_REQUEST,
      );
    }

    // Save audio file
    const fileName = `${responseId}_${Date.now()}.webm`;
    const audioDir = join(process.cwd(), 'uploads', 'audio');
    await fs.mkdir(audioDir, { recursive: true });
    const filePath = join(audioDir, fileName);
    await fs.writeFile(filePath, buffer);

    const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
    const audioUrl = `${baseUrl}/uploads/audio/${fileName}`;
    console.log('Audio saved:', audioUrl);

    // Update response with audio URL
    (response.responses as any).audioUrl = audioUrl;
    response.audioUrl = audioUrl;
    await this.surveyResponseRepository.save(response);
    await this.clearCache();

    return { success: true, audioUrl };
  }

  async createWithAudio(
    req: any,
    surveyMasterId: string,
  ): Promise<SurveyResponse> {
    const parts = req.parts();
    const fields: any = {};
    const audioFiles: Map<string, { buffer: Buffer; mimetype: string }> = new Map();

    for await (const part of parts) {
      if (part.type === 'field') {
        fields[part.fieldname] = part.value;
      } else if (part.type === 'file' && part.fieldname.startsWith('audio_')) {
        const questionId = part.fieldname.replace('audio_', '');
        const buffer = await part.toBuffer();
        audioFiles.set(questionId, { buffer, mimetype: part.mimetype });
      }
    }

    const createDto: CreateSurveyResponseDto = {
      surveyId: fields.surveyId,
      accessToken: fields.accessToken,
      responses: JSON.parse(fields.responses || '[]'),
      respondentName: fields.respondentName,
      respondentContact: fields.respondentContact,
      latitude: fields.latitude ? parseFloat(fields.latitude) : undefined,
      longitude: fields.longitude ? parseFloat(fields.longitude) : undefined,
      createdBy: surveyMasterId,
      updatedBy: surveyMasterId,
    };

    const survey = await this.surveyRepository.createQueryBuilder('survey')
      .leftJoinAndSelect('survey.questions', 'questions')
      .where('survey.id = :id', { id: createDto.surveyId })
      .getOne();

    if (!survey) {
      throw new CustomException(
        MESSAGE_CODES.NOT_FOUND,
        MessageType.ERROR,
        HttpStatus.NOT_FOUND,
      );
    }

    if (survey.accessToken !== createDto.accessToken) {
      throw new CustomException(
        { code: 'SURVEY_007', message: 'Invalid access token' },
        MessageType.ERROR,
        HttpStatus.FORBIDDEN,
      );
    }

    if (survey.status !== 'ACTIVE') {
      throw new CustomException(
        { code: 'SURVEY_005', message: 'Survey is not active' },
        MessageType.ERROR,
        HttpStatus.FORBIDDEN,
      );
    }

    if (!survey.surveyMasterIds || !survey.surveyMasterIds.includes(surveyMasterId)) {
      throw new CustomException(
        { code: 'SURVEY_001', message: 'You are not assigned to this survey' },
        MessageType.ERROR,
        HttpStatus.FORBIDDEN,
      );
    }

    if (survey.requiresLocationValidation) {
      if (!createDto.latitude || !createDto.longitude) {
        throw new CustomException(
          { code: 'LOCATION_002', message: 'Location is required for this survey' },
          MessageType.ERROR,
          HttpStatus.BAD_REQUEST,
        );
      }

      const locationConstraint = await this.locationRepository.findOne({
        where: { surveyId: createDto.surveyId, surveyMasterId, isActive: true },
      });

      if (locationConstraint) {
        const distance = this.calculateDistance(
          createDto.latitude,
          createDto.longitude,
          Number(locationConstraint.latitude),
          Number(locationConstraint.longitude),
        );

        if (distance > locationConstraint.radiusInMeters) {
          throw new CustomException(
            { code: 'LOCATION_003', message: 'You are outside the allowed survey area' },
            MessageType.ERROR,
            HttpStatus.FORBIDDEN,
          );
        }
      }
    }

    // Save audio files
    const audioDir = join(process.cwd(), 'uploads', 'audio');
    await fs.mkdir(audioDir, { recursive: true });

    const responsesWithAudio = await Promise.all(
      createDto.responses.map(async (r: any) => {
        if (audioFiles.has(r.questionId)) {
          const audio = audioFiles.get(r.questionId)!;
          
          // Validate audio
          const allowedTypes = ['audio/webm', 'audio/wav', 'audio/mp3', 'audio/mpeg', 'audio/ogg'];
          if (!allowedTypes.includes(audio.mimetype)) {
            throw new CustomException(
              { code: 'FILE_001', message: 'Invalid audio file type' },
              MessageType.ERROR,
              HttpStatus.BAD_REQUEST,
            );
          }

          const maxSize = 10 * 1024 * 1024;
          if (audio.buffer.length > maxSize) {
            throw new CustomException(
              { code: 'FILE_002', message: 'Audio file exceeds 10MB' },
              MessageType.ERROR,
              HttpStatus.BAD_REQUEST,
            );
          }

          const fileName = `${surveyMasterId}_${r.questionId}_${Date.now()}.webm`;
          const filePath = join(audioDir, fileName);
          await fs.writeFile(filePath, audio.buffer);

          return { ...r, audioUrl: `/uploads/audio/${fileName}` };
        }
        return r;
      }),
    );

    const surveyResponse = this.surveyResponseRepository.create({
      surveyId: createDto.surveyId,
      surveyMasterId,
      responses: responsesWithAudio,
      respondentName: createDto.respondentName,
      respondentContact: createDto.respondentContact,
      createdBy: createDto.createdBy,
    });

    const saved = await this.surveyResponseRepository.save(surveyResponse);
    await this.clearCache();
    return saved;
  }

  async uploadAudioResponse(
    dto: CreateAudioResponseDto,
    file: MultipartFile,
    surveyMasterId: string,
  ): Promise<{ success: boolean; audioUrl: string }> {
    // Validate survey and access token
    const survey = await this.surveyRepository.findOne({
      where: { id: dto.surveyId },
    });

    if (!survey) {
      throw new CustomException(
        MESSAGE_CODES.NOT_FOUND,
        MessageType.ERROR,
        HttpStatus.NOT_FOUND,
      );
    }

    if (survey.accessToken !== dto.accessToken) {
      throw new CustomException(
        { code: 'SURVEY_007', message: 'Invalid access token' },
        MessageType.ERROR,
        HttpStatus.FORBIDDEN,
      );
    }

    // Validate response exists
    const response = await this.surveyResponseRepository.findOne({
      where: { id: dto.responseId, surveyMasterId },
    });

    if (!response) {
      throw new CustomException(
        MESSAGE_CODES.NOT_FOUND,
        MessageType.ERROR,
        HttpStatus.NOT_FOUND,
      );
    }

    // Validate audio file
    const allowedTypes = ['audio/webm', 'audio/wav', 'audio/mp3', 'audio/mpeg', 'audio/ogg'];
    if (!allowedTypes.includes(file.mimetype)) {
      throw new CustomException(
        { code: 'FILE_001', message: 'Invalid audio file type' },
        MessageType.ERROR,
        HttpStatus.BAD_REQUEST,
      );
    }

    const buffer = await file.toBuffer();
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (buffer.length > maxSize) {
      throw new CustomException(
        { code: 'FILE_002', message: 'Audio file size exceeds 10MB limit' },
        MessageType.ERROR,
        HttpStatus.BAD_REQUEST,
      );
    }

    // Save audio file
    const fileName = `${dto.responseId}_${dto.questionId}_${Date.now()}.webm`;
    const audioDir = join(process.cwd(), 'uploads', 'audio');
    await fs.mkdir(audioDir, { recursive: true });
    const filePath = join(audioDir, fileName);
    await fs.writeFile(filePath, buffer);

    const audioUrl = `/uploads/audio/${fileName}`;

    // Update response with audio URL
    const updatedResponses = response.responses.map((r: any) => {
      if (r.questionId === dto.questionId) {
        return { ...r, audioUrl };
      }
      return r;
    });

    response.responses = updatedResponses;
    await this.surveyResponseRepository.save(response);
    await this.clearCache();

    return { success: true, audioUrl };
  }

  async createAnonymous(createDto: CreateSurveyResponseDto): Promise<SurveyResponse> {
    const survey = await this.surveyRepository.createQueryBuilder('survey')
      .leftJoinAndSelect('survey.questions', 'questions')
      .where('survey.id = :id', { id: createDto.surveyId })
      .getOne();

    if (!survey) {
      throw new CustomException(
        MESSAGE_CODES.NOT_FOUND,
        MessageType.ERROR,
        HttpStatus.NOT_FOUND,
      );
    }

    if (!survey.allowAnonymousSubmission) {
      throw new CustomException(
        { code: 'SURVEY_009', message: 'Anonymous submission is not allowed for this survey' },
        MessageType.ERROR,
        HttpStatus.FORBIDDEN,
      );
    }

    if (survey.accessToken !== createDto.accessToken) {
      throw new CustomException(
        { code: 'SURVEY_007', message: 'Invalid access token' },
        MessageType.ERROR,
        HttpStatus.FORBIDDEN,
      );
    }

    if (survey.status !== 'ACTIVE') {
      throw new CustomException(
        { code: 'SURVEY_005', message: 'Survey is not active' },
        MessageType.ERROR,
        HttpStatus.FORBIDDEN,
      );
    }

    // Get first assigned survey master
    const surveyMasterId = survey.surveyMasterIds?.[0];
    if (!surveyMasterId) {
      throw new CustomException(
        { code: 'SURVEY_008', message: 'No survey master assigned to this survey' },
        MessageType.ERROR,
        HttpStatus.BAD_REQUEST,
      );
    }

    if (survey.requiresLocationValidation) {
      if (!createDto.latitude || !createDto.longitude) {
        throw new CustomException(
          { code: 'LOCATION_002', message: 'Location is required for this survey' },
          MessageType.ERROR,
          HttpStatus.BAD_REQUEST,
        );
      }

      const locationConstraint = await this.locationRepository.findOne({
        where: { surveyId: createDto.surveyId, surveyMasterId, isActive: true },
      });

      if (locationConstraint) {
        const distance = this.calculateDistance(
          createDto.latitude,
          createDto.longitude,
          Number(locationConstraint.latitude),
          Number(locationConstraint.longitude),
        );

        if (distance > locationConstraint.radiusInMeters) {
          throw new CustomException(
            { code: 'LOCATION_003', message: 'You are outside the allowed survey area' },
            MessageType.ERROR,
            HttpStatus.FORBIDDEN,
          );
        }
      }
    }

    const validQuestionIds = new Set(survey.questions?.map(q => q.id) || []);
    const invalidQuestions = createDto.responses.filter(r => !validQuestionIds.has(r.questionId));
    
    if (invalidQuestions.length > 0) {
      throw new CustomException(
        { code: 'SURVEY_006', message: 'Invalid question IDs provided' },
        MessageType.ERROR,
        HttpStatus.BAD_REQUEST,
      );
    }

    const surveyResponse = this.surveyResponseRepository.create({
      surveyId: createDto.surveyId,
      surveyMasterId,
      responses: createDto.responses,
      respondentName: createDto.respondentName,
      respondentContact: createDto.respondentContact,
      latitude: createDto.latitude,
      longitude: createDto.longitude,
      createdBy: surveyMasterId,
    });

    const saved = await this.surveyResponseRepository.save(surveyResponse);
    await this.clearCache();
    return saved;
  }

  async createByMasterToken(createDto: CreateMasterSurveyResponseDto): Promise<SurveyResponse> {
    // Validate survey master token
    const surveyMaster = await this.surveyMasterRepository.findOne({
      where: { accessToken: createDto.masterToken },
    });

    if (!surveyMaster) {
      throw new CustomException(
        { code: 'AUTH_001', message: 'Invalid master token' },
        MessageType.ERROR,
        HttpStatus.UNAUTHORIZED,
      );
    }

    if (surveyMaster.status !== 'ACTIVE') {
      throw new CustomException(
        { code: 'AUTH_002', message: 'Survey master is not active' },
        MessageType.ERROR,
        HttpStatus.FORBIDDEN,
      );
    }

    const survey = await this.surveyRepository.createQueryBuilder('survey')
      .leftJoinAndSelect('survey.questions', 'questions')
      .where('survey.id = :id', { id: createDto.surveyId })
      .getOne();

    if (!survey) {
      throw new CustomException(
        MESSAGE_CODES.NOT_FOUND,
        MessageType.ERROR,
        HttpStatus.NOT_FOUND,
      );
    }

    if (survey.status !== 'ACTIVE') {
      throw new CustomException(
        { code: 'SURVEY_005', message: 'Survey is not active' },
        MessageType.ERROR,
        HttpStatus.FORBIDDEN,
      );
    }

    if (!survey.surveyMasterIds || !survey.surveyMasterIds.includes(surveyMaster.id)) {
      throw new CustomException(
        { code: 'SURVEY_001', message: 'This master is not assigned to this survey' },
        MessageType.ERROR,
        HttpStatus.FORBIDDEN,
      );
    }

    if (survey.requiresLocationValidation) {
      if (!createDto.latitude || !createDto.longitude) {
        throw new CustomException(
          { code: 'LOCATION_002', message: 'Location is required for this survey' },
          MessageType.ERROR,
          HttpStatus.BAD_REQUEST,
        );
      }

      const locationConstraint = await this.locationRepository.findOne({
        where: { surveyId: createDto.surveyId, surveyMasterId: surveyMaster.id, isActive: true },
      });

      if (locationConstraint) {
        const distance = this.calculateDistance(
          createDto.latitude,
          createDto.longitude,
          Number(locationConstraint.latitude),
          Number(locationConstraint.longitude),
        );

        if (distance > locationConstraint.radiusInMeters) {
          throw new CustomException(
            { code: 'LOCATION_003', message: 'You are outside the allowed survey area' },
            MessageType.ERROR,
            HttpStatus.FORBIDDEN,
          );
        }
      }
    }

    const validQuestionIds = new Set(survey.questions?.map(q => q.id) || []);
    const invalidQuestions = createDto.responses.filter(r => !validQuestionIds.has(r.questionId));
    
    if (invalidQuestions.length > 0) {
      throw new CustomException(
        { code: 'SURVEY_006', message: 'Invalid question IDs provided' },
        MessageType.ERROR,
        HttpStatus.BAD_REQUEST,
      );
    }

    const surveyResponse = this.surveyResponseRepository.create({
      surveyId: createDto.surveyId,
      surveyMasterId: surveyMaster.id,
      responses: createDto.responses,
      respondentName: createDto.respondentName,
      respondentContact: createDto.respondentContact,
      createdBy: surveyMaster.id,
    });

    const saved = await this.surveyResponseRepository.save(surveyResponse);
    await this.clearCache();
    return saved;
  }

  async createByMaster(createDto: CreateMasterSurveyResponseDto, surveyMasterId: string): Promise<SurveyResponse> {
    const survey = await this.surveyRepository.createQueryBuilder('survey')
      .leftJoinAndSelect('survey.questions', 'questions')
      .where('survey.id = :id', { id: createDto.surveyId })
      .getOne();

    if (!survey) {
      throw new CustomException(
        MESSAGE_CODES.NOT_FOUND,
        MessageType.ERROR,
        HttpStatus.NOT_FOUND,
      );
    }

    if (survey.status !== 'ACTIVE') {
      throw new CustomException(
        { code: 'SURVEY_005', message: 'Survey is not active' },
        MessageType.ERROR,
        HttpStatus.FORBIDDEN,
      );
    }

    if (!survey.surveyMasterIds || !survey.surveyMasterIds.includes(surveyMasterId)) {
      throw new CustomException(
        { code: 'SURVEY_001', message: 'You are not assigned to this survey' },
        MessageType.ERROR,
        HttpStatus.FORBIDDEN,
      );
    }

    if (survey.requiresLocationValidation) {
      if (!createDto.latitude || !createDto.longitude) {
        throw new CustomException(
          { code: 'LOCATION_002', message: 'Location is required for this survey' },
          MessageType.ERROR,
          HttpStatus.BAD_REQUEST,
        );
      }

      const locationConstraint = await this.locationRepository.findOne({
        where: { surveyId: createDto.surveyId, surveyMasterId, isActive: true },
      });

      if (locationConstraint) {
        const distance = this.calculateDistance(
          createDto.latitude,
          createDto.longitude,
          Number(locationConstraint.latitude),
          Number(locationConstraint.longitude),
        );

        if (distance > locationConstraint.radiusInMeters) {
          throw new CustomException(
            { code: 'LOCATION_003', message: 'You are outside the allowed survey area' },
            MessageType.ERROR,
            HttpStatus.FORBIDDEN,
          );
        }
      }
    }

    const validQuestionIds = new Set(survey.questions?.map(q => q.id) || []);
    const invalidQuestions = createDto.responses.filter(r => !validQuestionIds.has(r.questionId));
    
    if (invalidQuestions.length > 0) {
      throw new CustomException(
        { code: 'SURVEY_006', message: 'Invalid question IDs provided' },
        MessageType.ERROR,
        HttpStatus.BAD_REQUEST,
      );
    }

    const surveyResponse = this.surveyResponseRepository.create({
      surveyId: createDto.surveyId,
      surveyMasterId,
      responses: createDto.responses,
      respondentName: createDto.respondentName,
      respondentContact: createDto.respondentContact,
      createdBy: surveyMasterId,
    });

    const saved = await this.surveyResponseRepository.save(surveyResponse);
    await this.clearCache();
    return saved;
  }

  async create(createDto: CreateSurveyResponseDto, surveyMasterId: string): Promise<SurveyResponse> {
    console.log('Received DTO:', JSON.stringify(createDto, null, 2));
    console.log('Responses array:', createDto.responses);
    
    const survey = await this.surveyRepository.createQueryBuilder('survey')
      .leftJoinAndSelect('survey.questions', 'questions')
      .where('survey.id = :id', { id: createDto.surveyId })
      .getOne();

    if (!survey) {
      throw new CustomException(
        MESSAGE_CODES.NOT_FOUND,
        MessageType.ERROR,
        HttpStatus.NOT_FOUND,
      );
    }

    if (survey.accessToken !== createDto.accessToken) {
      throw new CustomException(
        { code: 'SURVEY_007', message: 'Invalid access token' },
        MessageType.ERROR,
        HttpStatus.FORBIDDEN,
      );
    }

    if (survey.status !== 'ACTIVE') {
      throw new CustomException(
        { code: 'SURVEY_005', message: 'Survey is not active' },
        MessageType.ERROR,
        HttpStatus.FORBIDDEN,
      );
    }

    if (!survey.surveyMasterIds || !survey.surveyMasterIds.includes(surveyMasterId)) {
      throw new CustomException(
        { code: 'SURVEY_001', message: 'You are not assigned to this survey' },
        MessageType.ERROR,
        HttpStatus.FORBIDDEN,
      );
    }

    // Validate location if required
    if (survey.requiresLocationValidation) {
      if (!createDto.latitude || !createDto.longitude) {
        throw new CustomException(
          { code: 'LOCATION_002', message: 'Location is required for this survey' },
          MessageType.ERROR,
          HttpStatus.BAD_REQUEST,
        );
      }

      const locationConstraint = await this.locationRepository.findOne({
        where: { surveyId: createDto.surveyId, surveyMasterId, isActive: true },
      });

      if (locationConstraint) {
        const distance = this.calculateDistance(
          createDto.latitude,
          createDto.longitude,
          Number(locationConstraint.latitude),
          Number(locationConstraint.longitude),
        );

        if (distance > locationConstraint.radiusInMeters) {
          throw new CustomException(
            { code: 'LOCATION_003', message: 'You are outside the allowed survey area' },
            MessageType.ERROR,
            HttpStatus.FORBIDDEN,
          );
        }
      }
    }

    // Validate question IDs belong to this survey
    const validQuestionIds = new Set(survey.questions?.map(q => q.id) || []);
    const invalidQuestions = createDto.responses.filter(r => !validQuestionIds.has(r.questionId));
    
    if (invalidQuestions.length > 0) {
      throw new CustomException(
        { code: 'SURVEY_006', message: 'Invalid question IDs provided' },
        MessageType.ERROR,
        HttpStatus.BAD_REQUEST,
      );
    }

    const surveyResponse = this.surveyResponseRepository.create({
      surveyId: createDto.surveyId,
      surveyMasterId,
      responses: createDto.responses,
      respondentName: createDto.respondentName,
      respondentContact: createDto.respondentContact,
      latitude: createDto.latitude,
      longitude: createDto.longitude,
      createdBy: createDto.createdBy,
    });

    console.log('Before save:', JSON.stringify(surveyResponse, null, 2));
    const saved = await this.surveyResponseRepository.save(surveyResponse);
    console.log('After save:', JSON.stringify(saved, null, 2));
    
    await this.clearCache();
    return saved;
  }

  async findAll(query: QuerySurveyResponseDto, userId?: string, userRole?: string): Promise<PaginatedResult<SurveyResponse>> {
    // Check if user is a survey master by querying the database
    let isSurveyMaster = false;
    if (userId) {
      const surveyMaster = await this.surveyMasterRepository.findOne({
        where: { id: userId },
      });
      isSurveyMaster = !!surveyMaster;
    }
    
    // For SURVEY_MASTER role, validate survey assignment
    if (isSurveyMaster && userId) {
      // If surveyId is provided, check if user is assigned to that specific survey
      if (query.surveyId) {
        const survey = await this.surveyRepository.findOne({
          where: { id: query.surveyId },
        });

        if (!survey) {
          throw new CustomException(
            MESSAGE_CODES.NOT_FOUND,
            MessageType.ERROR,
            HttpStatus.NOT_FOUND,
          );
        }

        if (!survey.surveyMasterIds || !survey.surveyMasterIds.includes(userId)) {
          throw new CustomException(
            { code: 'SURVEY_004', message: 'This survey is not assigned to you' },
            MessageType.ERROR,
            HttpStatus.FORBIDDEN,
          );
        }
      } else {
        // If no surveyId provided, only return responses for surveys assigned to this user
        const assignedSurveys = await this.surveyRepository.find({
          where: {},
        });
        
        const userAssignedSurveyIds = assignedSurveys
          .filter(s => s.surveyMasterIds && s.surveyMasterIds.includes(userId))
          .map(s => s.id);
        
        if (userAssignedSurveyIds.length === 0) {
          return {
            data: [],
            total: 0,
            page: query.page || 1,
            limit: query.limit || 10,
          };
        }
        
        // Filter responses to only include assigned surveys
        (query as any).assignedSurveyIds = userAssignedSurveyIds;
      }
    }

    const cacheKey = `surveyResponse:${JSON.stringify(query)}`;
    const cached = await this.cacheService.get<PaginatedResult<SurveyResponse>>(cacheKey);

    if (cached) {
      return cached;
    }

    const { page = 1, limit = 10 } = query;
    const queryBuilder = this.queryBuilderService.buildQuery(
      this.surveyResponseRepository,
      query,
      this.queryConfig,
    );

    const result = await this.queryBuilderService.paginate(queryBuilder, page, limit);
    await this.cacheService.set(cacheKey, result, 300);
    return result;
  }

  async findOne(id: string): Promise<SurveyResponse> {
    const cacheKey = `surveyResponse:${id}`;
    const cached = await this.cacheService.get<SurveyResponse>(cacheKey);
    if (cached) {
      return cached;
    }

    const surveyResponse = await this.surveyResponseRepository.findOne({
      where: { id },
      relations: ['survey', 'surveyMaster'],
    });

    if (!surveyResponse) {
      throw new CustomException(
        MESSAGE_CODES.NOT_FOUND,
        MessageType.ERROR,
        HttpStatus.NOT_FOUND,
      );
    }

    await this.cacheService.set(cacheKey, surveyResponse, 300);
    return surveyResponse;
  }

  async update(id: string, updateDto: UpdateSurveyResponseDto, surveyMasterId: string): Promise<SurveyResponse> {
    const surveyResponse = await this.surveyResponseRepository.findOne({
      where: { id },
    });

    if (!surveyResponse) {
      throw new CustomException(
        MESSAGE_CODES.NOT_FOUND,
        MessageType.ERROR,
        HttpStatus.NOT_FOUND,
      );
    }

    if (surveyResponse.surveyMasterId !== surveyMasterId) {
      throw new CustomException(
        { code: 'SURVEY_002', message: 'You can only update your own responses' },
        MessageType.ERROR,
        HttpStatus.FORBIDDEN,
      );
    }

    Object.assign(surveyResponse, updateDto);
    surveyResponse.updatedBy = surveyMasterId;

    const updated = await this.surveyResponseRepository.save(surveyResponse);
    await this.clearCache();
    return updated;
  }

  async remove(id: string, surveyMasterId: string): Promise<void> {
    const surveyResponse = await this.surveyResponseRepository.findOne({
      where: { id },
    });

    if (!surveyResponse) {
      throw new CustomException(
        MESSAGE_CODES.NOT_FOUND,
        MessageType.ERROR,
        HttpStatus.NOT_FOUND,
      );
    }

    if (surveyResponse.surveyMasterId !== surveyMasterId) {
      throw new CustomException(
        { code: 'SURVEY_003', message: 'You can only delete your own responses' },
        MessageType.ERROR,
        HttpStatus.FORBIDDEN,
      );
    }

    await this.surveyResponseRepository.softDelete(id);
    await this.clearCache();
  }

  async getCrosstab(surveyId: string, questionId: string): Promise<any> {
    const survey = await this.surveyRepository.createQueryBuilder('survey')
      .leftJoinAndSelect('survey.questions', 'questions')
      .where('survey.id = :id', { id: surveyId })
      .getOne();

    if (!survey) {
      throw new CustomException(
        MESSAGE_CODES.NOT_FOUND,
        MessageType.ERROR,
        HttpStatus.NOT_FOUND,
      );
    }

    const responses = await this.surveyResponseRepository.find({
      where: { surveyId },
    });

    if (responses.length === 0) {
      return {
        surveyId,
        selectedQuestionId: questionId,
        tabs: [],
        totalResponses: 0,
      };
    }

    // Get all other questions except the selected one
    const otherQuestions = survey.questions?.filter(q => q.id !== questionId) || [];

    // Build crosstab for each other question
    const tabs = otherQuestions.map((otherQuestion: any) => {
      const crosstab: Record<string, Record<string, number>> = {};
      const rowTotals: Record<string, number> = {};
      const columnTotals: Record<string, number> = {};
      let grandTotal = 0;

      responses.forEach(response => {
        const selectedAnswer = response.responses?.find((r: any) => r.questionId === questionId)?.answer;
        const otherAnswer = response.responses?.find((r: any) => r.questionId === otherQuestion.id)?.answer;

        if (selectedAnswer && otherAnswer) {
          const row = String(selectedAnswer).trim();
          const col = String(otherAnswer).trim();

          if (!crosstab[row]) crosstab[row] = {};
          crosstab[row][col] = (crosstab[row][col] || 0) + 1;
          rowTotals[row] = (rowTotals[row] || 0) + 1;
          columnTotals[col] = (columnTotals[col] || 0) + 1;
          grandTotal++;
        }
      });

      return {
        questionId: otherQuestion.id,
        questionText: otherQuestion.questionText,
        questionType: otherQuestion.type,
        crosstab,
        rowTotals,
        columnTotals,
        grandTotal,
      };
    });

    return {
      surveyId,
      selectedQuestionId: questionId,
      selectedQuestionText: survey.questions?.find((q: any) => q.id === questionId)?.questionText,
      tabs,
      totalResponses: responses.length,
    };
  }

  async getStats(surveyId: string): Promise<any> {
    const survey = await this.surveyRepository.createQueryBuilder('survey')
      .leftJoinAndSelect('survey.questions', 'questions')
      .leftJoinAndSelect('questions.options', 'options')
      .where('survey.id = :id', { id: surveyId })
      .orderBy('questions.order', 'ASC')
      .addOrderBy('options.order', 'ASC')
      .getOne();

    if (!survey) {
      throw new CustomException(
        MESSAGE_CODES.NOT_FOUND,
        MessageType.ERROR,
        HttpStatus.NOT_FOUND,
      );
    }

    const responses = await this.surveyResponseRepository.find({
      where: { surveyId },
    });

    const totalResponses = responses.length;
    
    // If no questions in database, extract from responses
    if (!survey.questions || survey.questions.length === 0) {
      if (responses.length === 0) {
        return {
          surveyId,
          surveyTitle: survey.title,
          totalResponses,
          questionStats: [],
        };
      }

      // Extract unique question IDs from responses
      const questionMap = new Map();
      responses.forEach(r => {
        r.responses?.forEach((ans: any) => {
          if (!questionMap.has(ans.questionId)) {
            questionMap.set(ans.questionId, []);
          }
          questionMap.get(ans.questionId).push(ans.answer);
        });
      });

      const questionStats = Array.from(questionMap.entries()).map(([questionId, answers]) => {
        const answerCounts: Record<string, number> = {};
        answers.forEach((answer: any) => {
          const key = String(answer || '').trim();
          if (key) {
            answerCounts[key] = (answerCounts[key] || 0) + 1;
          }
        });

        return {
          questionId,
          questionText: 'Question',
          questionType: 'text',
          totalAnswers: answers.length,
          answerCounts,
        };
      });

      return {
        surveyId,
        surveyTitle: survey.title,
        totalResponses,
        questionStats,
      };
    }

    const questionStats = survey.questions.map((question: any) => {
      const questionId = question.id;
      const answers = responses
        .map(r => r.responses?.find((ans: any) => ans.questionId === questionId))
        .filter(Boolean);

      const stats: any = {
        questionId,
        questionText: question.questionText,
        questionType: question.type,
        totalAnswers: answers.length,
      };

      if (question.type === 'multiple_choice' || question.type === 'single_choice') {
        const optionCounts: Record<string, number> = {};
        answers.forEach((ans: any) => {
          const value = Array.isArray(ans.answer) ? ans.answer : [ans.answer];
          value.forEach((v: string) => {
            optionCounts[v] = (optionCounts[v] || 0) + 1;
          });
        });
        stats.optionCounts = optionCounts;
      } else if (question.type === 'rating') {
        const ratings = answers.map((ans: any) => Number(ans.answer)).filter(r => !isNaN(r));
        stats.averageRating = ratings.length ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(2) : 0;
        stats.ratingDistribution = ratings.reduce((acc: Record<number, number>, r: number) => {
          acc[r] = (acc[r] || 0) + 1;
          return acc;
        }, {});
      } else {
        const answerCounts: Record<string, number> = {};
        answers.forEach((ans: any) => {
          const answer = String(ans.answer || '').trim();
          if (answer) {
            answerCounts[answer] = (answerCounts[answer] || 0) + 1;
          }
        });
        stats.answerCounts = answerCounts;
      }

      return stats;
    });

    return {
      surveyId,
      surveyTitle: survey.title,
      totalResponses,
      questionStats,
    };
  }

  private async clearCache(): Promise<void> {
    const patterns: string[] = ['surveyResponse:*'];
    for (const pattern of patterns) {
      const keys: string[] = await this.cacheService.getKeys(pattern);
      for (const key of keys) {
        await this.cacheService.del(key);
      }
    }
  }

  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371000; // Earth's radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
  }
}
