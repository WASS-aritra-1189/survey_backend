/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../shared/entity/base.entity';
import { Survey } from '../../surveys/entities/survey.entity';
import { SurveyMaster } from '../../survey-master/entities/survey-master.entity';

@Entity('survey_responses')
@Index(['surveyId'])
@Index(['surveyMasterId'])
export class SurveyResponse extends BaseEntity {
  @Column({ type: 'uuid' })
  surveyId: string;

  @ManyToOne(() => Survey)
  @JoinColumn({ name: 'surveyId' })
  survey: Survey;

  @Column({ type: 'uuid' })
  surveyMasterId: string;

  @ManyToOne(() => SurveyMaster)
  @JoinColumn({ name: 'surveyMasterId' })
  surveyMaster: SurveyMaster;

  @Column({ type: 'jsonb' })
  responses: any[];

  @Column({ type: 'varchar', length: 255, nullable: true })
  respondentName: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  respondentContact: string;

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  latitude: number;

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  longitude: number;

  @Column({ type: 'varchar', length: 500, nullable: true })
  audioUrl: string;
}
