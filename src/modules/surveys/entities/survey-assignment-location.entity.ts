/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { Column, Entity, Index, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { BaseEntity } from '../../../shared/entity/base.entity';
import { Survey } from './survey.entity';
import { SurveyMaster } from '../../survey-master/entities/survey-master.entity';
import { Zone } from '../../zones/entities/zone.entity';

@Entity('survey_assignment_locations')
@Unique(['surveyId', 'surveyMasterId'])
@Index(['surveyId'])
@Index(['surveyMasterId'])
export class SurveyAssignmentLocation extends BaseEntity {
  @Column({ type: 'uuid' })
  surveyId: string;

  @Column({ type: 'uuid' })
  surveyMasterId: string;

  @Column({ type: 'uuid', nullable: true })
  zoneId: string | null;

  @Column({ type: 'decimal', precision: 10, scale: 8 })
  latitude: number;

  @Column({ type: 'decimal', precision: 11, scale: 8 })
  longitude: number;

  @Column({ type: 'integer' })
  radiusInMeters: number;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @ManyToOne(() => Survey, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'surveyId' })
  survey: Survey;

  @ManyToOne(() => SurveyMaster, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'surveyMasterId' })
  surveyMaster: SurveyMaster;

  @ManyToOne(() => Zone, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'zoneId' })
  zone: Zone;
}
