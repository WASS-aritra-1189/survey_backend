/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import type { MultipartFile } from '@fastify/multipart';
import {
  BadRequestException,
  Controller,
  Inject,
  Post,
  Req,
} from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { FastifyRequest } from 'fastify';
import type {
  CdnUploadResult,
  IUploadsService,
  LocalUploadResult,
} from './interfaces/uploads-service.interface';

interface FastifyRequestWithMultipart extends FastifyRequest {
  file(): Promise<MultipartFile | undefined>;
}

@ApiTags('Uploads')
@Controller('uploads')
export class UploadsController {
  constructor(
    @Inject('IUploadsService') private readonly uploadsService: IUploadsService,
  ) {}

  @Post('file')
  @ApiOperation({ summary: 'Upload file to BunnyCDN' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async uploadFile(@Req() req: FastifyRequestWithMultipart): Promise<{
    success: boolean;
    data: CdnUploadResult;
  }> {
    const data = await this.getSingleFile(req);
    return this.uploadsService.uploadSingleFileToCdn(data);
  }

  @Post('local/file')
  @ApiOperation({ summary: 'Upload file to local uploads folder' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async uploadLocalFile(@Req() req: FastifyRequestWithMultipart): Promise<{
    success: boolean;
    data: LocalUploadResult;
  }> {
    const data = await this.getSingleFile(req);
    return this.uploadsService.uploadSingleFileToLocal(data);
  }

  private async getSingleFile(
    req: FastifyRequestWithMultipart,
  ): Promise<MultipartFile> {
    const data = await req.file();
    if (!data) {
      throw new BadRequestException('No file provided');
    }
    this.uploadsService.validateFile(data);
    return data;
  }
}
