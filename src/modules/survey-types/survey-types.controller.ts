import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { SurveyTypesService } from './survey-types.service';
import { CreateSurveyTypeDto, UpdateSurveyTypeDto } from './dto/survey-type.dto';
import { JwtAuthGuard } from '../../core/guards/jwt-auth.guard';
import { RolesGuard } from '../../core/guards/roles.guard';
import { Roles } from '../../core/decorators/roles.decorator';
import { UserRoles } from '../../shared/enums/accouts.enum';
import { CurrentUser } from '../../core/decorators/current-user.decorator';

@Controller('survey-types')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SurveyTypesController {
  constructor(private readonly surveyTypesService: SurveyTypesService) {}

  @Post()
  @Roles(UserRoles.ROOT, UserRoles.ADMIN)
  async create(@Body() dto: CreateSurveyTypeDto, @CurrentUser() user: any) {
    console.log('Received DTO:', JSON.stringify(dto, null, 2));
    return await this.surveyTypesService.create(dto, user.sub);
  }

  @Get()
  @Roles(UserRoles.ROOT, UserRoles.ADMIN)
  async findAll() {
    return await this.surveyTypesService.findAll();
  }

  @Get(':id')
  @Roles(UserRoles.ROOT, UserRoles.ADMIN)
  async findOne(@Param('id') id: string) {
    return await this.surveyTypesService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRoles.ROOT, UserRoles.ADMIN)
  async update(@Param('id') id: string, @Body() dto: UpdateSurveyTypeDto, @CurrentUser() user: any) {
    return await this.surveyTypesService.update(id, dto, user.sub);
  }

  @Delete(':id')
  @Roles(UserRoles.ROOT, UserRoles.ADMIN)
  async remove(@Param('id') id: string) {
    return await this.surveyTypesService.remove(id);
  }

  @Patch(':id/status')
  @Roles(UserRoles.ROOT, UserRoles.ADMIN)
  async updateStatus(@Param('id') id: string, @Body('isActive') isActive: boolean, @CurrentUser() user: any) {
    return await this.surveyTypesService.updateStatus(id, isActive, user.sub);
  }
}
