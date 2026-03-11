/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Device } from '../devices/entities/device.entity';
import { SurveyMaster } from '../survey-master/entities/survey-master.entity';
import { Survey } from '../surveys/entities/survey.entity';

@Injectable()
export class GlobalSearchService {
  constructor(
    @InjectRepository(Device)
    private readonly deviceRepository: Repository<Device>,
    @InjectRepository(SurveyMaster)
    private readonly surveyMasterRepository: Repository<SurveyMaster>,
    @InjectRepository(Survey)
    private readonly surveyRepository: Repository<Survey>,
  ) {}

  async search(query?: string) {
    if (!query) {
      return { devices: [], surveyMasters: [], surveys: [] };
    }

    const searchPattern = `%${query}%`;

    const [devices, surveyMasters, surveys] = await Promise.all([
      this.deviceRepository
        .createQueryBuilder('device')
        .where('device.deviceName ILIKE :search OR device.deviceId ILIKE :search', { search: searchPattern })
        .take(10)
        .getMany(),
      
      this.surveyMasterRepository
        .createQueryBuilder('sm')
        .where('sm.loginId ILIKE :search', { search: searchPattern })
        .take(10)
        .getMany(),
      
      this.surveyRepository
        .createQueryBuilder('survey')
        .where('survey.title ILIKE :search OR survey.description ILIKE :search', { search: searchPattern })
        .take(10)
        .getMany(),
    ]);

    return { devices, surveyMasters, surveys };
  }
}
