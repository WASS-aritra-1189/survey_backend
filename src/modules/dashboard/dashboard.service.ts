import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Survey } from '../surveys/entities/survey.entity';
import { SurveyMaster } from '../survey-master/entities/survey-master.entity';
import { SurveyResponse } from '../survey-responses/entities/survey-response.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Survey)
    private readonly surveyRepository: Repository<Survey>,
    @InjectRepository(SurveyMaster)
    private readonly surveyMasterRepository: Repository<SurveyMaster>,
    @InjectRepository(SurveyResponse)
    private readonly surveyResponseRepository: Repository<SurveyResponse>,
  ) {}

  async getDashboardStats() {
    const [
      totalSurveyMasters,
      totalSurveys,
      totalResponses,
      surveys,
      platformDistribution,
      monthlyTrend,
      weeklyCompletion,
    ] = await Promise.all([
      this.getTotalSurveyMasters(),
      this.getTotalSurveys(),
      this.getTotalResponses(),
      this.getAllSurveys(),
      this.getPlatformDistribution(),
      this.getMonthlyTrend(),
      this.getWeeklyCompletion(),
    ]);

    const completionRate = this.calculateCompletionRate(surveys);

    return {
      totalSurveyMasters,
      totalSurveys,
      totalResponses,
      completionRate,
      platformDistribution,
      monthlyTrend,
      weeklyCompletion,
    };
  }

  private async getTotalSurveyMasters(): Promise<number> {
    return await this.surveyMasterRepository.count();
  }

  private async getTotalSurveys(): Promise<number> {
    return await this.surveyRepository.count();
  }

  private async getTotalResponses(): Promise<number> {
    return await this.surveyResponseRepository.count();
  }

  private async getAllSurveys(): Promise<Survey[]> {
    return await this.surveyRepository
      .createQueryBuilder('survey')
      .loadRelationCountAndMap('survey.totalResponses', 'survey.surveyResponses')
      .getMany();
  }

  private calculateCompletionRate(surveys: Survey[]): number {
    if (surveys.length === 0) return 0;
    
    const totalTarget = surveys.reduce((sum, s) => sum + (s.target || 0), 0);
    const totalResponses = surveys.reduce((sum, s) => sum + (s.totalResponses || 0), 0);
    
    return totalTarget > 0 ? Math.round((totalResponses / totalTarget) * 100) : 0;
  }

  private async getPlatformDistribution() {
    const surveys = await this.surveyRepository.find();
    
    const platforms = { ANDROID: 0, IOS: 0, WEB: 0 };
    
    surveys.forEach(survey => {
      survey.deviceType?.forEach(device => {
        if (platforms[device] !== undefined) {
          platforms[device]++;
        }
      });
    });
    
    const total = Object.values(platforms).reduce((sum, count) => sum + count, 0);
    
    return {
      android: total > 0 ? Math.round((platforms.ANDROID / total) * 100) : 0,
      ios: total > 0 ? Math.round((platforms.IOS / total) * 100) : 0,
      web: total > 0 ? Math.round((platforms.WEB / total) * 100) : 0,
    };
  }

  private async getMonthlyTrend() {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const responses = await this.surveyResponseRepository
      .createQueryBuilder('response')
      .where('response.createdAt >= :date', { date: sixMonthsAgo })
      .orderBy('response.createdAt', 'ASC')
      .getMany();

    const monthlyData = {};
    
    responses.forEach(response => {
      const month = new Date(response.createdAt).toLocaleString('en-US', { month: 'short', year: 'numeric' });
      monthlyData[month] = (monthlyData[month] || 0) + 1;
    });

    return Object.entries(monthlyData).map(([month, count]) => ({ month, count }));
  }

  private async getWeeklyCompletion() {
    const surveys = await this.surveyRepository
      .createQueryBuilder('survey')
      .loadRelationCountAndMap('survey.totalResponses', 'survey.surveyResponses')
      .getMany();

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const responses = await this.surveyResponseRepository
      .createQueryBuilder('response')
      .where('response.createdAt >= :date', { date: startOfMonth })
      .getMany();

    const weeklyData: { week: string; completionRate: number }[] = [];
    const totalTarget = surveys.reduce((sum, s) => sum + (s.target || 0), 0);
    
    for (let i = 0; i < 4; i++) {
      const weekStart = new Date(startOfMonth);
      weekStart.setDate(startOfMonth.getDate() + i * 7);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 7);

      const weekResponses = responses.filter(r => {
        const createdAt = new Date(r.createdAt);
        return createdAt >= weekStart && createdAt < weekEnd;
      });

      const weekResponseCount = weekResponses.length;
      const completionRate = totalTarget > 0 ? Math.round((weekResponseCount / totalTarget) * 100) : 0;

      weeklyData.push({
        week: `Week ${i + 1}`,
        completionRate,
      });
    }

    return weeklyData;
  }
}
