/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import type { MultipartFile } from '@fastify/multipart';

export interface UploadResult {
  fileName: string;
  originalName: string;
  size: number;
  mimeType: string;
}

export interface CdnUploadResult extends UploadResult {
  url: string;
}

export interface LocalUploadResult extends UploadResult {
  path: string;
}

export abstract class IUploadsService {
  abstract uploadSingleFileToCdn(file: MultipartFile): Promise<{
    success: boolean;
    data: CdnUploadResult;
  }>;

  abstract uploadSingleFileToLocal(file: MultipartFile): Promise<{
    success: boolean;
    data: LocalUploadResult;
  }>;

  abstract validateFile(file: MultipartFile): void;
  abstract validateFileSize(size: number): void;
}
