/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { Column, Entity, Index, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../shared/entity/base.entity';
import { Survey } from './survey.entity';
import { QuestionOption } from './question-option.entity';

export enum QuestionType {
  TEXT = 'text',
  TEXTAREA = 'textarea',
  SINGLE_CHOICE = 'single_choice',
  MULTIPLE_CHOICE = 'multiple_choice',
  RATING = 'rating',
  DATE = 'date',
  NUMBER = 'number',
  FILE = 'file',
}

@Entity('questions')
@Index(['surveyId'])
@Index(['order'])
export class Question extends BaseEntity {
  @Column({ type: 'varchar', length: 500 })
  questionText: string;

  @Column({ type: 'enum', enum: QuestionType })
  type: QuestionType;

  @Column({ type: 'integer' })
  order: number;

  @Column({ type: 'boolean', default: true })
  isRequired: boolean;

  @Column({ type: 'uuid' })
  surveyId: string;

  @ManyToOne(() => Survey, survey => survey.questions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'surveyId' })
  survey: Survey;

  @OneToMany(() => QuestionOption, option => option.question, { cascade: true })
  options: QuestionOption[];
}
