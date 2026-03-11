/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../shared/entity/base.entity';
import { DefaultStatus } from '../../../shared/enums/status.enum';
import { Setting } from '../../settings/entities/setting.entity';
import { StaffDetail } from '../../staff-details/entities/staff-detail.entity';

@Entity('designations')
@Index(['name'])
@Index(['priority'])
@Index(['status'])
@Index(['settingId'])
export class Designation extends BaseEntity {
  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'int', default: 0 })
  priority: number;

  @Column({ type: 'enum', enum: DefaultStatus, default: DefaultStatus.PENDING })
  status: DefaultStatus;

  @Column({ type: 'uuid' })
  settingId: string;

  @ManyToOne('Setting')
  @JoinColumn({ name: 'settingId' })
  setting: Setting;

  @OneToMany('StaffDetail', 'designation')
  staffDetails: StaffDetail[];
}
