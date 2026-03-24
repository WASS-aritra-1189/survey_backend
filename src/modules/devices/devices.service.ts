/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MESSAGE_CODES } from '../../shared/constants/message-codes';
import { MessageType } from '../../shared/enums/message-type.enum';
import { DefaultStatus } from '../../shared/enums/status.enum';
import { CustomException } from '../../shared/exceptions/custom.exception';
import { ActivityLogsService } from '../activity-logs/activity-logs.service';
import { ActivityAction, ActivityModule } from '../activity-logs/entities/activity-log.entity';
import { SurveyMaster } from '../survey-master/entities/survey-master.entity';
import { CreateDeviceDto } from './dto/create-device.dto';
import { QueryDeviceDto } from './dto/query-device.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';
import { Device } from './entities/device.entity';

@Injectable()
export class DevicesService {
  constructor(
    @InjectRepository(Device)
    private readonly deviceRepository: Repository<Device>,
    @InjectRepository(SurveyMaster)
    private readonly surveyMasterRepository: Repository<SurveyMaster>,
    private readonly activityLogsService: ActivityLogsService,
  ) {}

  async create(dto: CreateDeviceDto, accountId: string): Promise<Device> {
    const existing = await this.deviceRepository.findOne({ where: { deviceId: dto.deviceId } });
    if (existing) {
      throw new CustomException(
        { code: 'DEVICE_001', message: 'Device ID already exists' },
        MessageType.ERROR,
        HttpStatus.CONFLICT,
      );
    }
    const device = this.deviceRepository.create({ ...dto, createdBy: accountId });
    
    // If zoneId is provided, copy zone location to device location
    if (dto.zoneId) {
      const zone = await this.deviceRepository.query(
        'SELECT latitude, longitude FROM zones WHERE id = $1',
        [dto.zoneId]
      );
      if (zone && zone[0]) {
        device.location = `${zone[0].latitude},${zone[0].longitude}`;
      }
    }
    
    const saved = await this.deviceRepository.save(device);
    await this.activityLogsService.log(
      accountId,
      ActivityModule.DEVICE,
      ActivityAction.CREATE,
      `Created device: ${dto.deviceName}`,
      saved.id,
    );
    return saved;
  }

  async findAll(query: QueryDeviceDto): Promise<{ data: Device[]; total: number }> {
    const { page = 1, limit = 1000, status, assignedTo, search } = query;
    const qb = this.deviceRepository.createQueryBuilder('device')
      .leftJoinAndSelect('device.surveyMaster', 'surveyMaster');

    if (status) {
      qb.andWhere('device.status = :status', { status });
    }
    if (assignedTo) {
      qb.andWhere('device.assignedTo = :assignedTo', { assignedTo });
    }
    if (search) {
      qb.andWhere('(device.deviceName ILIKE :search OR device.deviceId ILIKE :search)', { search: `%${search}%` });
    }

    qb.skip((page - 1) * limit).take(limit).orderBy('device.createdAt', 'DESC');

    const [data, total] = await qb.getManyAndCount();
    return { data, total };
  }

  async findOne(id: string): Promise<Device> {
    const device = await this.deviceRepository.findOne({
      where: { id },
      relations: ['surveyMaster'],
    });
    if (!device) {
      throw new CustomException(MESSAGE_CODES.NOT_FOUND, MessageType.ERROR, HttpStatus.NOT_FOUND);
    }
    return device;
  }

  async update(id: string, dto: UpdateDeviceDto, accountId: string): Promise<Device> {
    const device = await this.findOne(id);
    
    // Check if deviceId is being updated and if it already exists
    if (dto.deviceId && dto.deviceId !== device.deviceId) {
      const existing = await this.deviceRepository.findOne({ where: { deviceId: dto.deviceId } });
      if (existing) {
        throw new CustomException(
          { code: 'DEVICE_001', message: 'Device ID already exists' },
          MessageType.ERROR,
          HttpStatus.CONFLICT,
        );
      }
    }
    
    // If zoneId is provided, copy zone location to device location
    if (dto.zoneId) {
      const zone = await this.deviceRepository.query(
        'SELECT latitude, longitude FROM zones WHERE id = $1',
        [dto.zoneId]
      );
      if (zone && zone[0]) {
        dto.location = `${zone[0].latitude},${zone[0].longitude}`;
      }
    }
    
    Object.assign(device, dto, { updatedBy: accountId });
    const updated = await this.deviceRepository.save(device);
    await this.activityLogsService.log(
      accountId,
      ActivityModule.DEVICE,
      ActivityAction.UPDATE,
      `Updated device: ${device.deviceName}`,
      id,
    );
    return updated;
  }

  async updateStatus(id: string, status: DefaultStatus, accountId: string): Promise<Device> {
    const device = await this.findOne(id);
    device.status = status;
    device.updatedBy = accountId;
    return await this.deviceRepository.save(device);
  }

  async assignDevice(id: string, surveyMasterId: string, accountId: string): Promise<Device> {
    const device = await this.findOne(id);
    
    // Check if device is already assigned
    if (device.assignedTo) {
      throw new CustomException(
        { code: 'DEVICE_003', message: 'Device is already assigned to another survey master. Please unassign first.' },
        MessageType.ERROR,
        HttpStatus.CONFLICT,
      );
    }
    
    const surveyMaster = await this.surveyMasterRepository.findOne({ where: { id: surveyMasterId } });
    if (!surveyMaster) {
      throw new CustomException(
        { code: 'DEVICE_002', message: 'Survey master not found' },
        MessageType.ERROR,
        HttpStatus.NOT_FOUND,
      );
    }
    device.assignedTo = surveyMasterId;
    device.updatedBy = accountId;
    await this.activityLogsService.log(
      accountId,
      ActivityModule.DEVICE,
      ActivityAction.UPDATE,
      `Assigned device: ${device.deviceName} to survey master: ${surveyMaster.loginId}`,
      id,
    );
    return await this.deviceRepository.save(device);
  }

  async unassignDevice(id: string, accountId: string): Promise<Device> {
    const device = await this.deviceRepository.findOne({ where: { id } });
    if (!device) {
      throw new CustomException(MESSAGE_CODES.NOT_FOUND, MessageType.ERROR, HttpStatus.NOT_FOUND);
    }
    device.assignedTo = null;
    device.updatedBy = accountId;
    await this.deviceRepository.save(device);
    
    // Reload with relations to get fresh data
    const reloaded = await this.deviceRepository.findOne({
      where: { id },
      relations: ['surveyMaster'],
    });
    if (!reloaded) {
      throw new CustomException(MESSAGE_CODES.NOT_FOUND, MessageType.ERROR, HttpStatus.NOT_FOUND);
    }
    await this.activityLogsService.log(
      accountId,
      ActivityModule.DEVICE,
      ActivityAction.UPDATE,
      `Unassigned device: ${reloaded.deviceName}`,
      id,
    );
    return reloaded;
  }

  async getLocations(): Promise<any[]> {
    const devices = await this.deviceRepository
      .createQueryBuilder('device')
      .select([
        'device.id',
        'device.deviceName',
        'device.deviceId',
        'device.status',
        'device.battery',
        'device.location',
        'device.zoneId',
        'device.assignedTo',
      ])
      .leftJoin('zones', 'zone', 'zone.id = device.zoneId')
      .addSelect(['zone.name', 'zone.latitude', 'zone.longitude', 'zone.radiusInMeters', 'zone.isActive'])
      .getRawMany();

    return devices.map((row) => {
      const [lat, lng] = row.device_location ? row.device_location.split(',').map(Number) : [null, null];
      return {
        id: row.device_id,
        deviceName: row.device_deviceName,
        deviceId: row.device_deviceId,
        status: row.device_status,
        battery: row.device_battery,
        location: {
          latitude: lat,
          longitude: lng,
          raw: row.device_location,
        },
        zone: row.device_zoneId
          ? {
              id: row.device_zoneId,
              name: row.zone_name,
              latitude: row.zone_latitude !== undefined ? Number(row.zone_latitude) : null,
              longitude: row.zone_longitude !== undefined ? Number(row.zone_longitude) : null,
              radiusInMeters: row.zone_radiusInMeters,
              isActive: row.zone_isActive,
            }
          : null,
        assignedTo: row.device_assignedTo,
      };
    });
  }

  async remove(id: string): Promise<void> {
    const device = await this.findOne(id);
    await this.deviceRepository.remove(device);
    await this.activityLogsService.log(
      device.createdBy,
      ActivityModule.DEVICE,
      ActivityAction.DELETE,
      `Deleted device: ${device.deviceName}`,
      id,
    );
  }
}
