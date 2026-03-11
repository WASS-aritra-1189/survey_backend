import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SurveyType } from './entities/survey-type.entity';
import { CreateSurveyTypeDto, UpdateSurveyTypeDto } from './dto/survey-type.dto';
import { Survey } from '../surveys/entities/survey.entity';

@Injectable()
export class SurveyTypesService {
  constructor(
    @InjectRepository(SurveyType)
    private readonly surveyTypeRepository: Repository<SurveyType>,
    @InjectRepository(Survey)
    private readonly surveyRepository: Repository<Survey>,
  ) {}

  async create(dto: CreateSurveyTypeDto, accountId: string): Promise<SurveyType> {
    const existing = await this.surveyTypeRepository.findOneBy({ name: dto.name });
    if (existing) throw new ConflictException('Survey type name already exists');
    const surveyType = this.surveyTypeRepository.create({
      name: dto.name,
      templateQuestions: dto.templateQuestions || [],
    });
    surveyType.createdBy = accountId;
    return await this.surveyTypeRepository.save(surveyType);
  }

  async findAll(): Promise<any[]> {
    const types = await this.surveyTypeRepository.find({ order: { name: 'ASC' } });
    const result = await Promise.all(
      types.map(async (type) => {
        const surveyCount = await this.surveyRepository.count({ where: { surveyTypeId: type.id } });
        return { ...type, surveyCount };
      })
    );
    return result;
  }

  async findOne(id: string): Promise<SurveyType | null> {
    return await this.surveyTypeRepository.findOneBy({ id });
  }

  async update(id: string, dto: UpdateSurveyTypeDto, accountId: string): Promise<SurveyType | null> {
    const surveyType = await this.findOne(id);
    if (!surveyType) return null;
    if (dto.name && dto.name !== surveyType.name) {
      const existing = await this.surveyTypeRepository.findOneBy({ name: dto.name });
      if (existing) throw new ConflictException('Survey type name already exists');
    }
    if (dto.name) surveyType.name = dto.name;
    if (dto.templateQuestions !== undefined) surveyType.templateQuestions = dto.templateQuestions;
    if (dto.isActive !== undefined) surveyType.isActive = dto.isActive;
    surveyType.updatedBy = accountId;
    return await this.surveyTypeRepository.save(surveyType);
  }

  async remove(id: string): Promise<void> {
    await this.surveyTypeRepository.delete(id);
  }

  async updateStatus(id: string, isActive: boolean, accountId: string): Promise<SurveyType | null> {
    const surveyType = await this.findOne(id);
    if (!surveyType) return null;
    surveyType.isActive = isActive;
    surveyType.updatedBy = accountId;
    return await this.surveyTypeRepository.save(surveyType);
  }
}
