import { IsEnum, IsInt, IsOptional, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { DownloadFormat } from '../entities/download-history.entity';

export class QueryDownloadHistoryDto {
  @ApiPropertyOptional({ enum: DownloadFormat })
  @IsOptional()
  @IsEnum(DownloadFormat)
  format?: DownloadFormat;

  @ApiPropertyOptional()
  @IsOptional()
  dateFrom?: string;

  @ApiPropertyOptional()
  @IsOptional()
  dateTo?: string;

  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ default: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 20;
}
