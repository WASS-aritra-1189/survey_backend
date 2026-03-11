import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../../../shared/entity/base.entity';

@Entity('zones')
export class Zone extends BaseEntity {
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'decimal', precision: 10, scale: 8 })
  latitude: number;

  @Column({ type: 'decimal', precision: 11, scale: 8 })
  longitude: number;

  @Column({ type: 'integer' })
  radiusInMeters: number;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;
}
