/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../shared/entity/base.entity';
import { Currency } from '../../../shared/enums/currency.enum';
import { PaymentGateway } from '../../../shared/enums/payment-gateway.enum';
import { PaymentMethod } from '../../../shared/enums/payment-method.enum';
import { PaymentMode } from '../../../shared/enums/payment-mode.enum';
import { PaymentStatus } from '../../../shared/enums/payment-status.enum';
import { PaymentType } from '../../../shared/enums/payment-type.enum';
import { DefaultStatus } from '../../../shared/enums/status.enum';
import { Account } from '../../account/entities/account.entity';
import { BankDetail } from '../../bank-details/entities/bank-detail.entity';
import { Setting } from '../../settings/entities/setting.entity';

@Entity('payment_history')
@Index(['accountId'])
@Index(['paymentStatus'])
@Index(['paymentType'])
@Index(['transactionId'])
@Index(['gatewayTransactionId'])
@Index(['processedAt'])
@Index(['fromAccountId'])
@Index(['toAccountId'])
export class PaymentHistory extends BaseEntity {
  @Column({ type: 'decimal', precision: 15, scale: 2 })
  amount: number;

  @Column({ type: 'enum', enum: Currency, default: Currency.INR })
  currency: Currency;

  @Column({ type: 'enum', enum: PaymentType })
  paymentType: PaymentType;

  @Column({ type: 'enum', enum: PaymentMethod })
  paymentMethod: PaymentMethod;

  @Column({ type: 'enum', enum: PaymentMode, default: PaymentMode.ONLINE })
  paymentMode: PaymentMode;

  @Column({ type: 'enum', enum: PaymentStatus, default: PaymentStatus.PENDING })
  paymentStatus: PaymentStatus;

  @Column({ type: 'varchar', length: 255, nullable: true })
  transactionId: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  signature: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  gatewayTransactionId: string;

  @Column({ type: 'enum', enum: PaymentGateway, nullable: true })
  gatewayName: PaymentGateway;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'text', nullable: true })
  remarks: string;

  @Column({ type: 'json', nullable: true })
  gatewayResponse: object;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  fees: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  tax: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  netAmount: number;

  @Column({ type: 'timestamp', nullable: true })
  processedAt: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
  referenceNumber: string;

  @Column({ type: 'uuid', nullable: true })
  bankDetailId: string;

  @ManyToOne(() => BankDetail, { nullable: true })
  @JoinColumn({ name: 'bankDetailId' })
  bankDetail: BankDetail;

  @Column({ type: 'enum', enum: DefaultStatus, default: DefaultStatus.ACTIVE })
  status: DefaultStatus;

  @Column({ type: 'uuid' })
  accountId: string;

  @ManyToOne(() => Account)
  @JoinColumn()
  account: Account;

  @Column({ type: 'uuid', nullable: true })
  fromAccountId: string;

  @ManyToOne(() => Account, { nullable: true })
  @JoinColumn({ name: 'fromAccountId' })
  fromAccount: Account;

  @Column({ type: 'uuid', nullable: true })
  toAccountId: string;

  @ManyToOne(() => Account, { nullable: true })
  @JoinColumn({ name: 'toAccountId' })
  toAccount: Account;

  @Column({ type: 'uuid', nullable: true })
  settingId: string;

  @ManyToOne(() => Setting, { nullable: true })
  @JoinColumn({ name: 'settingId' })
  setting: Setting;
}
