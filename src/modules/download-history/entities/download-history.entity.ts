import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../shared/entity/base.entity';
import { Account } from '../../account/entities/account.entity';

export enum DownloadFormat {
  CSV = 'CSV',
  PDF = 'PDF',
  EXCEL = 'EXCEL',
  JSON = 'JSON',
}

@Entity('download_history')
@Index(['accountId'])
@Index(['format'])
export class DownloadHistory extends BaseEntity {
  @Column({ type: 'uuid' })
  accountId: string;

  @ManyToOne(() => Account)
  @JoinColumn({ name: 'accountId' })
  account: Account;

  @Column({ type: 'varchar', length: 255 })
  fileName: string;

  @Column({ type: 'enum', enum: DownloadFormat })
  format: DownloadFormat;

  @Column({ type: 'varchar', length: 255 })
  source: string;

  @Column({ type: 'int', default: 0 })
  recordCount: number;

  @Column({ type: 'varchar', length: 45, nullable: true })
  ipAddress: string;
}
