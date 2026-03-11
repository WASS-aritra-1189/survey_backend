/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../shared/entity/base.entity';
import {
  AccountStatus,
  BankName,
  BankType,
} from '../../../shared/enums/bank.enum';
import { Account } from '../../account/entities/account.entity';
import { PaymentHistory } from '../../payment-history/entities/payment-history.entity';
import { Setting } from '../../settings/entities/setting.entity';

@Entity('bank_details')
@Index(['accountId', 'isDefault'])
@Index(['accountNumber'])
@Index(['ifscCode'])
@Index(['status'])
@Index(['bankName'])
export class BankDetail extends BaseEntity {
  @Column({ length: 100 })
  accountHolderName: string;

  @Column({ length: 20, unique: true })
  accountNumber: string;

  @Column({ length: 20 })
  confirmAccountNumber: string;

  @Column({ length: 11 })
  ifscCode: string;

  @Column({ type: 'enum', enum: BankName })
  bankName: BankName;

  @Column({ length: 100 })
  branchName: string;

  @Column({ type: 'text', nullable: true })
  branchAddress?: string;

  @Column({
    type: 'enum',
    enum: BankType,
    default: BankType.SAVINGS,
  })
  accountType: BankType;

  @Column({
    type: 'enum',
    enum: AccountStatus,
    default: AccountStatus.ACTIVE,
  })
  status: AccountStatus;

  @Column({ type: 'boolean', default: false })
  isDefault: boolean;

  @Column({ length: 11, nullable: true })
  swiftCode?: string;

  @Column({ length: 20, nullable: true })
  routingNumber?: string;

  @Column({ length: 34, nullable: true })
  iban?: string;

  @Column({ length: 10, nullable: true })
  bankCode?: string;

  @Column({ length: 8, nullable: true })
  sortCode?: string;

  @Column({ length: 6, nullable: true })
  bsbNumber?: string;

  @Column({ length: 9, nullable: true })
  transitNumber?: string;

  @Column({ length: 4, nullable: true })
  institutionNumber?: string;

  @Column({ length: 9, nullable: true })
  micrCode?: string;

  @Column({ length: 50, nullable: true })
  upiId?: string;

  @Column({ length: 3, default: 'INR' })
  currencyCode: string;

  @Column({ length: 2, default: 'IN' })
  countryCode: string;

  @Column({ type: 'uuid' })
  accountId: string;

  @ManyToOne(() => Account)
  @JoinColumn()
  account: Account;

  @Column({ type: 'uuid' })
  settingId: string;

  @ManyToOne('Setting')
  @JoinColumn({ name: 'settingId' })
  setting: Setting;

  @OneToMany(() => PaymentHistory, paymentHistory => paymentHistory.bankDetail)
  paymentHistories: PaymentHistory[];
}
