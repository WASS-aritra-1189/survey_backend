import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DownloadHistory } from './entities/download-history.entity';
import { CreateDownloadHistoryDto } from './dto/create-download-history.dto';
import { QueryDownloadHistoryDto } from './dto/query-download-history.dto';

@Injectable()
export class DownloadHistoryService {
  constructor(
    @InjectRepository(DownloadHistory)
    private readonly repo: Repository<DownloadHistory>,
  ) {}

  async create(
    accountId: string,
    dto: CreateDownloadHistoryDto,
    ipAddress?: string,
  ): Promise<DownloadHistory> {
    const record = this.repo.create({
      accountId,
      format: dto.format,
      fileName: dto.fileName,
      source: dto.source,
      recordCount: dto.recordCount ?? 0,
      ipAddress,
    });
    return this.repo.save(record);
  }

  async findAll(query: QueryDownloadHistoryDto) {
    const { page = 1, limit = 20, format, dateFrom, dateTo } = query;
    const qb = this.repo
      .createQueryBuilder('dh')
      .leftJoinAndSelect('dh.account', 'account')
      .orderBy('dh.createdAt', 'DESC');

    if (format) qb.andWhere('dh.format = :format', { format });
    if (dateFrom) qb.andWhere('dh.createdAt >= :dateFrom', { dateFrom: new Date(dateFrom) });
    if (dateTo) {
      const to = new Date(dateTo);
      to.setHours(23, 59, 59, 999);
      qb.andWhere('dh.createdAt <= :dateTo', { dateTo: to });
    }

    qb.skip((page - 1) * limit).take(limit);
    const [data, total] = await qb.getManyAndCount();
    return { data, total, page, limit };
  }

  async findByUser(accountId: string, query: QueryDownloadHistoryDto) {
    const { page = 1, limit = 20, format, dateFrom, dateTo } = query;
    const qb = this.repo
      .createQueryBuilder('dh')
      .leftJoinAndSelect('dh.account', 'account')
      .where('dh.accountId = :accountId', { accountId })
      .orderBy('dh.createdAt', 'DESC');

    if (format) qb.andWhere('dh.format = :format', { format });
    if (dateFrom) qb.andWhere('dh.createdAt >= :dateFrom', { dateFrom: new Date(dateFrom) });
    if (dateTo) {
      const to = new Date(dateTo);
      to.setHours(23, 59, 59, 999);
      qb.andWhere('dh.createdAt <= :dateTo', { dateTo: to });
    }

    qb.skip((page - 1) * limit).take(limit);
    const [data, total] = await qb.getManyAndCount();
    return { data, total, page, limit };
  }
}
