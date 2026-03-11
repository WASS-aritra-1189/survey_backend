/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { Column, Entity, Index, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../shared/entity/base.entity';
import { Question } from './question.entity';

@Entity('question_options')
@Index(['questionId'])
@Index(['order'])
export class QuestionOption extends BaseEntity {
  @Column({ type: 'varchar', length: 255 })
  optionText: string;

  @Column({ type: 'integer' })
  order: number;

  @Column({ type: 'uuid' })
  questionId: string;

  @ManyToOne(() => Question, question => question.options, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'questionId' })
  question: Question;
}
