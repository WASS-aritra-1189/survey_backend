import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from '../../core/decorators/roles.decorator';
import { RolesGuard } from '../../core/guards/roles.guard';
import { UserRoles } from '../../shared/enums/accouts.enum';
import { FaqService } from './faqs.service';
import { CreateFaqDto, UpdateFaqDto } from './dto/faq.dto';

@ApiTags('faqs')
@Controller('faqs')
export class FaqController {
  constructor(private readonly faqService: FaqService) {}

  @Get('public')
  async findPublic() {
    return await this.faqService.findPublic();
  }

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth()
  @Roles(UserRoles.ROOT, UserRoles.ADMIN)
  async create(@Body() dto: CreateFaqDto, @Request() req: { user: { sub: string } }) {
    return await this.faqService.create(dto, req.user.sub);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth()
  @Roles(UserRoles.ROOT, UserRoles.ADMIN)
  async findAll() {
    return await this.faqService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth()
  @Roles(UserRoles.ROOT, UserRoles.ADMIN)
  async findOne(@Param('id') id: string) {
    return await this.faqService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth()
  @Roles(UserRoles.ROOT, UserRoles.ADMIN)
  async update(@Param('id') id: string, @Body() dto: UpdateFaqDto) {
    return await this.faqService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth()
  @Roles(UserRoles.ROOT, UserRoles.ADMIN)
  async remove(@Param('id') id: string) {
    await this.faqService.remove(id);
    return { message: 'FAQ deleted successfully' };
  }
}