import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DownloadFormat } from '../entities/download-history.entity';

export class CreateDownloadHistoryDto {
  @ApiProperty({ enum: DownloadFormat })
  @IsEnum(DownloadFormat)
  format: DownloadFormat;

  @ApiProperty()
  @IsString()
  fileName: string;

  @ApiProperty({ description: 'Page / feature that triggered the download' })
  @IsString()
  source: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(0)
  recordCount?: number;
}
