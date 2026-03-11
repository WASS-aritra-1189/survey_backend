import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Zone } from './entities/zone.entity';
import { CreateZoneDto, UpdateZoneDto } from './dto/zone.dto';
import { SurveyAssignmentLocation } from '../surveys/entities/survey-assignment-location.entity';
import { Device } from '../devices/entities/device.entity';

@Injectable()
export class ZonesService {
  constructor(
    @InjectRepository(Zone)
    private readonly zoneRepository: Repository<Zone>,
    @InjectRepository(SurveyAssignmentLocation)
    private readonly assignmentRepository: Repository<SurveyAssignmentLocation>,
    @InjectRepository(Device)
    private readonly deviceRepository: Repository<Device>,
  ) {}

  async create(dto: CreateZoneDto, accountId: string): Promise<Zone> {
    const existing = await this.zoneRepository.findOneBy({ name: dto.name });
    if (existing) throw new ConflictException('Zone name already exists');
    const zone = this.zoneRepository.create(dto);
    zone.createdBy = accountId;
    return await this.zoneRepository.save(zone);
  }

  async findAll(): Promise<any[]> {
    const zones = await this.zoneRepository.find({ order: { name: 'ASC' } });
    const zonesWithCount = await Promise.all(
      zones.map(async (zone) => {
        const assignmentCount = await this.assignmentRepository.count({ where: { zoneId: zone.id } });
        const deviceCount = await this.zoneRepository.manager.count('devices', { where: { zoneId: zone.id } });
        return { ...zone, assignmentCount, deviceCount };
      })
    );
    return zonesWithCount;
  }

  async findOne(id: string): Promise<any> {
    const zone = await this.zoneRepository.findOneBy({ id });
    if (!zone) return null;
    
    // Get devices in this zone
    const devices = await this.deviceRepository.find({ where: { zoneId: id } });
    
    return { ...zone, devices };
  }

  async update(id: string, dto: UpdateZoneDto, accountId: string): Promise<Zone | null> {
    const zone = await this.zoneRepository.findOneBy({ id });
    if (!zone) return null;
    if (dto.name && dto.name !== zone.name) {
      const existing = await this.zoneRepository.findOneBy({ name: dto.name });
      if (existing) throw new ConflictException('Zone name already exists');
    }
    Object.assign(zone, dto);
    zone.updatedBy = accountId;
    return await this.zoneRepository.save(zone);
  }

  async remove(id: string): Promise<void> {
    await this.zoneRepository.delete(id);
  }

  async updateStatus(id: string, isActive: boolean, accountId: string): Promise<Zone | null> {
    const zone = await this.zoneRepository.findOneBy({ id });
    if (!zone) return null;
    zone.isActive = isActive;
    zone.updatedBy = accountId;
    return await this.zoneRepository.save(zone);
  }
}
