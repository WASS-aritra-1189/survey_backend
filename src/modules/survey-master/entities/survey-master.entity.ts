/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { Column, Entity, Index, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { BaseEntity } from '../../../shared/entity/base.entity';
import { DefaultStatus } from '../../../shared/enums/status.enum';
import { Account } from '../../account/entities/account.entity';
import { Setting } from '../../settings/entities/setting.entity';

@Entity('survey_masters')
@Index(['loginId'])
@Index(['status'])
@Index(['accountId'])
export class SurveyMaster extends BaseEntity {
  @Column({ unique: true })
  loginId: string;

  @Column({ type: 'text' })
  password: string;

  @Column({ type: 'int', default: 0 })
  surveyLimit: number;

  @Column({
    type: 'enum',
    enum: DefaultStatus,
    default: DefaultStatus.PENDING,
  })
  status: DefaultStatus;

  @Column({ type: 'uuid' })
  accountId: string;

  @Column({ type: 'uuid', nullable: true })
  settingId: string;

  @Column({ type: 'varchar', length: 4, unique: true })
  accessToken: string;

  @ManyToOne(() => Account)
  @JoinColumn({ name: 'accountId' })
  account: Account;

  @ManyToOne(() => Setting)
  @JoinColumn({ name: 'settingId' })
  setting: Setting;
}
