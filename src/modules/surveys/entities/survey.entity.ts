/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { Column, Entity, Index, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../shared/entity/base.entity';
import { DefaultStatus } from '../../../shared/enums/status.enum';
import { DeviceType } from 'src/shared/enums/device-type';
import { SurveyResponse } from '../../survey-responses/entities/survey-response.entity';
import { Question } from './question.entity';
@Entity('surveys')
@Index(['status'])
export class Survey extends BaseEntity {
  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @OneToMany(() => Question, question => question.survey, { cascade: true })
  questions: Question[];

  @Column({ type: 'jsonb', nullable: true, default: [] })
  surveyMasterIds: string[];

  @Column({
    type: 'enum',
    enum: DefaultStatus,
    default: DefaultStatus.PENDING,
  })
  status: DefaultStatus;

  @Column({ type: 'integer', nullable: true })
  target: number;

  @Column({ type: 'jsonb', nullable: true, default: [] })
  deviceType: DeviceType[];

  @Column({ type: 'varchar', length: 4, unique: true })
  accessToken: string;

  @Column({ type: 'boolean', default: false })
  requiresLocationValidation: boolean;

  @Column({ type: 'boolean', default: false })
  allowAnonymousSubmission: boolean;

  @Column({ type: 'uuid', nullable: true })
  surveyTypeId: string;

  @OneToMany(() => SurveyResponse, response => response.survey)
  surveyResponses: SurveyResponse[];

  totalResponses?: number;

  get completionPercentage(): number {
    if (!this.target || this.target === 0) return 0;
    return Math.min(Math.round(((this.totalResponses || 0) / this.target) * 100), 100);
  }
  
}
