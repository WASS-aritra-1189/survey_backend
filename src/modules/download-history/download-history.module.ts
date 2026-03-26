import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DownloadHistory } from './entities/download-history.entity';
import { DownloadHistoryController } from './download-history.controller';
import { DownloadHistoryService } from './download-history.service';

@Module({
  imports: [TypeOrmModule.forFeature([DownloadHistory])],
  controllers: [DownloadHistoryController],
  providers: [DownloadHistoryService],
  exports: [DownloadHistoryService],
})
export class DownloadHistoryModule {}
