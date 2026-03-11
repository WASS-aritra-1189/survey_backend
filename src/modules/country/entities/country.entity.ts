/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { Column, Entity, Index, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../shared/entity/base.entity';
import { DefaultStatus } from '../../../shared/enums/status.enum';
import { City } from '../../city/entities/city.entity';
import { State } from '../../state/entities/state.entity';

@Entity('countries')
@Index(['name'])
@Index(['code'])
@Index(['status'])
export class Country extends BaseEntity {
  @Column({ unique: true })
  name: string;

  @Column({ unique: true, length: 2 })
  code: string;

  @Column({ nullable: true })
  flag: string;

  @Column({ type: 'enum', enum: DefaultStatus, default: DefaultStatus.PENDING })
  status: DefaultStatus;

  @OneToMany(() => State, state => state.country)
  states: State[];

  @OneToMany(() => City, city => city.country)
  cities: City[];
}
