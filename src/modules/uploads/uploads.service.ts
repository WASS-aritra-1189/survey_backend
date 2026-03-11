/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import type { MultipartFile } from '@fastify/multipart';
import { BadRequestException, Injectable } from '@nestjs/common';
import { promises as fs } from 'fs';
import { join } from 'path';
import { BunnyCdnUtils } from '../../shared/utils/bunnycdn.utils';
import {
  CdnUploadResult,
  IUploadsService,
  LocalUploadResult,
} from './interfaces/uploads-service.interface';

@Injectable()
export class UploadsService implements IUploadsService {
  constructor(private readonly bunnyCdnUtils: BunnyCdnUtils) {}

  async uploadSingleFileToCdn(file: MultipartFile): Promise<{
    success: boolean;
    data: CdnUploadResult;
  }> {
    this.validateFile(file);
    const buffer = await file.toBuffer();
    this.validateFileSize(buffer.length);

    const fileName = this.bunnyCdnUtils.generateFileName(
      file.filename || 'file',
    );
    const fileUrl = await this.bunnyCdnUtils.uploadFile(buffer, {
      fileName,
      contentType: file.mimetype,
    });

    return {
      success: true,
      data: {
        fileName,
        originalName: file.filename || 'file',
        url: fileUrl,
        size: buffer.length,
        mimeType: file.mimetype,
      },
    };
  }

  async uploadSingleFileToLocal(file: MultipartFile): Promise<{
    success: boolean;
    data: LocalUploadResult;
  }> {
    this.validateFile(file);
    const buffer = await file.toBuffer();
    this.validateFileSize(buffer.length);

    const fileName = this.generateLocalFileName(file.filename || 'file');
    const filePath = join(process.cwd(), 'uploads', fileName);

    await fs.mkdir(join(process.cwd(), 'uploads'), { recursive: true });
    await fs.writeFile(filePath, buffer);

    return {
      success: true,
      data: {
        fileName,
        originalName: file.filename || 'file',
        path: `/uploads/${fileName}`,
        size: buffer.length,
        mimeType: file.mimetype,
      },
    };
  }

  validateFile(file: MultipartFile): void {
    const allowedTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/webp',
      'application/pdf',
      'text/plain',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];

    if (!allowedTypes.includes(file.mimetype)) {
      throw new BadRequestException(`File type ${file.mimetype} not allowed`);
    }
  }

  validateFileSize(size: number): void {
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (size > maxSize) {
      throw new BadRequestException('File size exceeds 10MB limit');
    }
  }

  private generateLocalFileName(originalName: string): string {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substring(2);
    const extension = originalName.split('.').pop() ?? 'bin';
    return `${timestamp}_${random}.${extension}`;
  }
}
