import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ZonesService } from './zones.service';
import { CreateZoneDto, UpdateZoneDto } from './dto/zone.dto';
import { JwtAuthGuard } from '../../core/guards/jwt-auth.guard';
import { RolesGuard } from '../../core/guards/roles.guard';
import { Roles } from '../../core/decorators/roles.decorator';
import { UserRoles } from '../../shared/enums/accouts.enum';
import { CurrentUser } from '../../core/decorators/current-user.decorator';

@Controller('zones')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ZonesController {
  constructor(private readonly zonesService: ZonesService) {}

  @Post()
  @Roles(UserRoles.ROOT, UserRoles.ADMIN)
  async create(@Body() dto: CreateZoneDto, @CurrentUser() user: any) {
    return await this.zonesService.create(dto, user.sub);
  }

  @Get()
  @Roles(UserRoles.ROOT, UserRoles.ADMIN)
  async findAll() {
    const zones = await this.zonesService.findAll();
    return zones;
  }

  @Get(':id')
  @Roles(UserRoles.ROOT, UserRoles.ADMIN)
  async findOne(@Param('id') id: string) {
    return await this.zonesService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRoles.ROOT, UserRoles.ADMIN)
  async update(@Param('id') id: string, @Body() dto: UpdateZoneDto, @CurrentUser() user: any) {
    return await this.zonesService.update(id, dto, user.sub);
  }

  @Delete(':id')
  @Roles(UserRoles.ROOT, UserRoles.ADMIN)
  async remove(@Param('id') id: string) {
    return await this.zonesService.remove(id);
  }

  @Patch(':id/status')
  @Roles(UserRoles.ROOT, UserRoles.ADMIN)
  async updateStatus(@Param('id') id: string, @Body('isActive') isActive: boolean, @CurrentUser() user: any) {
    return await this.zonesService.updateStatus(id, isActive, user.sub);
  }
}
