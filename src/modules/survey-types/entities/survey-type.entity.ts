import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../../shared/entity/base.entity';

@Entity('survey_types')
export class SurveyType extends BaseEntity {
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'jsonb', nullable: true })
  templateQuestions: any[];

  @Column({ type: 'boolean', default: true })
  isActive: boolean;
}
