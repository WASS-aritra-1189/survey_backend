/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from '../../core/decorators/roles.decorator';
import { Permissions } from '../../core/decorators/permissions.decorator';
import { ResponseMessage } from '../../core/decorators/response-message.decorator';
import { RolesGuard } from '../../core/guards/roles.guard';
import { PermissionsGuard } from '../../core/guards/permissions.guard';
import { MESSAGE_CODES } from '../../shared/constants/message-codes';
import { UserRoles } from '../../shared/enums/accouts.enum';
import { PermissionType } from '../../shared/enums/permissions.enum';
import { AssignDeviceDto } from './dto/assign-device.dto';
import { CreateDeviceDto } from './dto/create-device.dto';
import { QueryDeviceDto } from './dto/query-device.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';
import { UpdateDeviceStatusDto } from './dto/update-device-status.dto';
import { DevicesService } from './devices.service';

@ApiTags('devices')
@Controller('devices')
@UseGuards(AuthGuard('jwt'), RolesGuard, PermissionsGuard)
@ApiBearerAuth()
export class DevicesController {
  constructor(private readonly devicesService: DevicesService) {}

  @Post()
  @Roles(UserRoles.ROOT, UserRoles.ADMIN, UserRoles.ROOT_STAFF, UserRoles.STAFF)
  @Permissions(PermissionType.CREATE, 'devices')
  @ResponseMessage(MESSAGE_CODES.DATA_CREATED.code)
  @ApiOperation({ summary: 'Create device' })
  @ApiResponse({ status: 201 })
  async create(@Body() dto: CreateDeviceDto, @Request() req: { user: { sub: string } }) {
    return await this.devicesService.create(dto, req.user.sub);
  }

  @Get()
  @Roles(UserRoles.ROOT, UserRoles.ADMIN, UserRoles.ROOT_STAFF, UserRoles.STAFF)
  @Permissions(PermissionType.READ, 'devices')
  @ResponseMessage(MESSAGE_CODES.DATA_RETRIEVED.code)
  @ApiOperation({ summary: 'Get all devices' })
  @ApiResponse({ status: 200 })
  async findAll(@Query() query: QueryDeviceDto) {
    return await this.devicesService.findAll(query);
  }

  @Patch(':id/status')
  @Roles(UserRoles.ROOT, UserRoles.ADMIN, UserRoles.ROOT_STAFF, UserRoles.STAFF)
  @Permissions(PermissionType.UPDATE, 'devices')
  @ResponseMessage(MESSAGE_CODES.DATA_UPDATED.code)
  @ApiOperation({ summary: 'Update device status' })
  @ApiResponse({ status: 200 })
  async updateStatus(@Param('id') id: string, @Body() dto: UpdateDeviceStatusDto, @Request() req: { user: { sub: string } }) {
    return await this.devicesService.updateStatus(id, dto.status, req.user.sub);
  }

  @Patch(':id/assign')
  @Roles(UserRoles.ROOT, UserRoles.ADMIN, UserRoles.ROOT_STAFF, UserRoles.STAFF)
  @Permissions(PermissionType.UPDATE, 'devices')
  @ResponseMessage(MESSAGE_CODES.DATA_UPDATED.code)
  @ApiOperation({ summary: 'Assign device to survey master' })
  @ApiResponse({ status: 200 })
  async assignDevice(@Param('id') id: string, @Body() dto: AssignDeviceDto, @Request() req: { user: { sub: string } }) {
    return await this.devicesService.assignDevice(id, dto.surveyMasterId, req.user.sub);
  }

  @Patch(':id/unassign')
  @Roles(UserRoles.ROOT, UserRoles.ADMIN, UserRoles.ROOT_STAFF, UserRoles.STAFF)
  @Permissions(PermissionType.UPDATE, 'devices')
  @ResponseMessage(MESSAGE_CODES.DATA_UPDATED.code)
  @ApiOperation({ summary: 'Unassign device from survey master' })
  @ApiResponse({ status: 200 })
  async unassignDevice(@Param('id') id: string, @Request() req: { user: { sub: string } }) {
    console.log('Unassign called with device ID:', id);
    console.log('User:', req.user);
    try {
      const result = await this.devicesService.unassignDevice(id, req.user.sub);
      console.log('Unassign successful:', result);
      return result;
    } catch (error) {
      console.error('Unassign error:', error);
      throw error;
    }
  }

  @Get('locations')
  @Roles(UserRoles.ROOT, UserRoles.ADMIN, UserRoles.ROOT_STAFF, UserRoles.STAFF)
  @Permissions(PermissionType.READ, 'devices')
  @ResponseMessage(MESSAGE_CODES.DATA_RETRIEVED.code)
  @ApiOperation({ summary: 'Get location of all devices with zone info' })
  @ApiResponse({ status: 200 })
  async getLocations() {
    return await this.devicesService.getLocations();
  }

  @Get(':id')
  @Roles(UserRoles.ROOT, UserRoles.ADMIN, UserRoles.ROOT_STAFF, UserRoles.STAFF)
  @Permissions(PermissionType.READ, 'devices')
  @ResponseMessage(MESSAGE_CODES.DATA_RETRIEVED.code)
  @ApiOperation({ summary: 'Get device by ID' })
  @ApiResponse({ status: 200 })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.devicesService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRoles.ROOT, UserRoles.ADMIN, UserRoles.ROOT_STAFF, UserRoles.STAFF)
  @Permissions(PermissionType.UPDATE, 'devices')
  @ResponseMessage(MESSAGE_CODES.DATA_UPDATED.code)
  @ApiOperation({ summary: 'Update device' })
  @ApiResponse({ status: 200 })
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateDeviceDto, @Request() req: { user: { sub: string } }) {
    return await this.devicesService.update(id, dto, req.user.sub);
  }

  @Delete(':id')
  @Roles(UserRoles.ROOT, UserRoles.ADMIN, UserRoles.ROOT_STAFF, UserRoles.STAFF)
  @Permissions(PermissionType.DELETE, 'devices')
  @ResponseMessage(MESSAGE_CODES.DATA_DELETED.code)
  @ApiOperation({ summary: 'Delete device' })
  @ApiResponse({ status: 200 })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.devicesService.remove(id);
    return { message: 'Device deleted successfully' };
  }
}
