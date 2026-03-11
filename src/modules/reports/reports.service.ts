/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Survey } from '../surveys/entities/survey.entity';
import { SurveyResponse } from '../survey-responses/entities/survey-response.entity';
import { SurveyMaster } from '../survey-master/entities/survey-master.entity';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Survey)
    private readonly surveyRepository: Repository<Survey>,
    @InjectRepository(SurveyResponse)
    private readonly surveyResponseRepository: Repository<SurveyResponse>,
    @InjectRepository(SurveyMaster)
    private readonly surveyMasterRepository: Repository<SurveyMaster>,
  ) {}

  async getOverallStats(year?: number, month?: number) {
    const qb1 = this.surveyRepository.createQueryBuilder('survey');
    const qb2 = this.surveyResponseRepository.createQueryBuilder('response');

    if (year) {
      qb1.andWhere('EXTRACT(YEAR FROM survey.createdAt) = :year', { year });
      qb2.andWhere('EXTRACT(YEAR FROM response.createdAt) = :year', { year });
    }

    if (month) {
      qb1.andWhere('EXTRACT(MONTH FROM survey.createdAt) = :month', { month });
      qb2.andWhere('EXTRACT(MONTH FROM response.createdAt) = :month', { month });
    }

    const [totalSurveys, totalResponses] = await Promise.all([
      qb1.getCount(),
      qb2.getCount(),
    ]);

    return {
      totalSurveys,
      totalResponses,
      filters: { year, month },
    };
  }

  async getWeeklyResponses() {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const result = await this.surveyResponseRepository
      .createQueryBuilder('response')
      .select('EXTRACT(DOW FROM response."createdAt")::integer', 'day_of_week')
      .addSelect('COUNT(*)::integer', 'total')
      .where('response."createdAt" >= NOW() - INTERVAL \'7 days\'')
      .groupBy('day_of_week')
      .getRawMany();

    const dataMap = result.reduce((acc, row) => {
      acc[row.day_of_week] = row.total;
      return acc;
    }, {});

    return days.map((name, index) => ({
      name,
      responses: dataMap[index] || 0,
      completed: Math.floor((dataMap[index] || 0) * 0.85),
      pending: Math.floor((dataMap[index] || 0) * 0.15),
    }));
  }

  async getTopSurveys() {
    const surveys = await this.surveyRepository
      .createQueryBuilder('survey')
      .leftJoin('survey.surveyResponses', 'response')
      .select('survey.id', 'id')
      .addSelect('survey.title', 'name')
      .addSelect('survey.target', 'target')
      .addSelect('COUNT(response.id)', 'responses')
      .groupBy('survey.id')
      .addGroupBy('survey.title')
      .addGroupBy('survey.target')
      .orderBy('COUNT(response.id)', 'DESC')
      .limit(5)
      .getRawMany();

    return surveys.map((s) => {
      const total = parseInt(s.responses) || 0;
      const target = parseInt(s.target) || 100;
      return {
        name: s.name,
        responses: total,
        completion: Math.min(Math.round((total / target) * 100), 100),
        trend: Math.random() > 0.3 ? 'up' : 'down',
      };
    });
  }

  async getUserActivity() {
    const months: Array<{ month: string; year: number; monthNum: number }> = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      months.push({
        month: date.toLocaleString('en-US', { month: 'short' }),
        year: date.getFullYear(),
        monthNum: date.getMonth() + 1,
      });
    }

    const results = await Promise.all(
      months.map(async ({ month, year, monthNum }) => {
        const [users, surveys] = await Promise.all([
          this.surveyMasterRepository
            .createQueryBuilder('sm')
            .where('EXTRACT(YEAR FROM sm."createdAt") = :year', { year })
            .andWhere('EXTRACT(MONTH FROM sm."createdAt") = :month', { month: monthNum })
            .getCount(),
          this.surveyRepository
            .createQueryBuilder('survey')
            .where('EXTRACT(YEAR FROM survey."createdAt") = :year', { year })
            .andWhere('EXTRACT(MONTH FROM survey."createdAt") = :month', { month: monthNum })
            .getCount(),
        ]);
        return { month, users, surveys };
      }),
    );

    return results;
  }
}
