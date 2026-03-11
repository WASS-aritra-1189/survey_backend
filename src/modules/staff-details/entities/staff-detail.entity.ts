/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { Column, Entity, Index, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { BaseEntity } from '../../../shared/entity/base.entity';
import { Gender } from '../../../shared/enums/gender.enum';
import { Account } from '../../account/entities/account.entity';
import { Designation } from '../../designations/entities/designation.entity';

@Entity('staff_details')
@Index(['email'])
@Index(['phone'])
@Index(['employeeId'])
@Index(['accountId'])
@Index(['designationId'])
@Index(['createdAt'])
export class StaffDetail extends BaseEntity {
  @Column({ type: 'varchar', length: 100 })
  firstName: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  middleName: string;

  @Column({ type: 'varchar', length: 100 })
  lastName: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 20 })
  phone: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  alternatePhone: string;

  @Column({ type: 'date', nullable: true })
  dateOfBirth: Date;

  @Column({ type: 'enum', enum: Gender, nullable: true })
  gender: Gender;

  @Column({ type: 'varchar', length: 255, nullable: true })
  address: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  city: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  state: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  zipCode: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  country: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  profilePicture: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  employeeId: string;

  @Column({ type: 'date', nullable: true })
  joiningDate: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  salary: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  emergencyContactName: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  emergencyContactPhone: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  emergencyContactRelation: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  idProof1Type: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  idProof1Number: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  idProof1Document: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  idProof2Type: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  idProof2Number: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  idProof2Document: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  addressProofType: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  addressProofNumber: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  addressProofDocument: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  highestEducation: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  educationInstitute: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  educationYear: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  educationCertificate: string;

  @Column({ type: 'json', nullable: true })
  skills: string[];

  @Column({ type: 'text', nullable: true })
  workExperience: string;

  @Column({ type: 'uuid' })
  accountId: string;

  @Column({ type: 'uuid', nullable: true })
  designationId: string;

  @OneToOne('Account')
  @JoinColumn({ name: 'accountId' })
  account: Account;

  @ManyToOne(() => Designation)
  @JoinColumn({ name: 'designationId' })
  designation: Designation;
}
