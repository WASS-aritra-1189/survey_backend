/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../shared/entity/base.entity';
import { DefaultStatus } from '../../../shared/enums/status.enum';
import { SurveyMaster } from '../../survey-master/entities/survey-master.entity';

@Entity('devices')
@Index(['deviceId'], { unique: true })
@Index(['status'])
export class Device extends BaseEntity {
  @Column({ type: 'varchar', length: 255 })
  deviceName: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  deviceId: string;

  @Column({ type: 'enum', enum: DefaultStatus, default: DefaultStatus.ACTIVE })
  status: DefaultStatus;

  @Column({ type: 'int', nullable: true })
  battery: number;

  @Column({ type: 'varchar', length: 500, nullable: true })
  location: string;

  @Column({ type: 'uuid', nullable: true })
  zoneId: string | null;

  @Column({ type: 'uuid', nullable: true })
  assignedTo: string | null;

  @ManyToOne(() => SurveyMaster, { nullable: true })
  @JoinColumn({ name: 'assignedTo' })
  surveyMaster: SurveyMaster;
}
