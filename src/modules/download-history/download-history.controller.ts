import { Body, Controller, Get, Ip, Param, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../core/decorators/current-user.decorator';
import { Roles } from '../../core/decorators/roles.decorator';
import { ResponseMessage } from '../../core/decorators/response-message.decorator';
import { RolesGuard } from '../../core/guards/roles.guard';
import { MESSAGE_CODES } from '../../shared/constants/message-codes';
import { UserRoles } from '../../shared/enums/accouts.enum';
import { CreateDownloadHistoryDto } from './dto/create-download-history.dto';
import { QueryDownloadHistoryDto } from './dto/query-download-history.dto';
import { DownloadHistoryService } from './download-history.service';

@ApiTags('download-history')
@Controller('download-history')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiBearerAuth()
export class DownloadHistoryController {
  constructor(private readonly service: DownloadHistoryService) {}

  @Post()
  @Roles(UserRoles.ROOT, UserRoles.ADMIN, UserRoles.ROOT_STAFF, UserRoles.STAFF)
  @ResponseMessage(MESSAGE_CODES.DATA_CREATED.code)
  @ApiOperation({ summary: 'Record a download event' })
  async create(
    @Body() dto: CreateDownloadHistoryDto,
    @CurrentUser() user: { sub: string },
    @Ip() ip: string,
  ) {
    return this.service.create(user.sub, dto, ip);
  }

  @Get()
  @Roles(UserRoles.ROOT, UserRoles.ADMIN, UserRoles.ROOT_STAFF)
  @ResponseMessage(MESSAGE_CODES.DATA_RETRIEVED.code)
  @ApiOperation({ summary: 'Get all download history (admin)' })
  async findAll(@Query() query: QueryDownloadHistoryDto) {
    return this.service.findAll(query);
  }

  @Get('my')
  @Roles(UserRoles.ROOT, UserRoles.ADMIN, UserRoles.ROOT_STAFF, UserRoles.STAFF)
  @ResponseMessage(MESSAGE_CODES.DATA_RETRIEVED.code)
  @ApiOperation({ summary: 'Get download history for current user' })
  async findMine(
    @CurrentUser() user: { sub: string },
    @Query() query: QueryDownloadHistoryDto,
  ) {
    return this.service.findByUser(user.sub, query);
  }

  @Get('user/:accountId')
  @Roles(UserRoles.ROOT, UserRoles.ADMIN, UserRoles.ROOT_STAFF)
  @ResponseMessage(MESSAGE_CODES.DATA_RETRIEVED.code)
  @ApiOperation({ summary: 'Get download history for a specific user' })
  async findByUser(
    @Param('accountId') accountId: string,
    @Query() query: QueryDownloadHistoryDto,
  ) {
    return this.service.findByUser(accountId, query);
  }
}
