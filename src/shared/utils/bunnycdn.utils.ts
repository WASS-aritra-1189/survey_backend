/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { Injectable } from '@nestjs/common';
import { getEnvOrThrow } from '../../core/utils/env.utils';

export interface BunnyCdnConfig {
  storageZoneName: string;
  accessKey: string;
  baseUrl: string;
  pullZoneUrl: string;
}

export interface UploadOptions {
  fileName: string;
  path?: string;
  contentType?: string;
}

export interface FileListResponse {
  [key: string]: unknown;
}

@Injectable()
export class BunnyCdnUtils {
  private readonly config: BunnyCdnConfig;

  constructor() {
    this.config = {
      storageZoneName: getEnvOrThrow('BUNNYCDN_STORAGE_ZONE'),
      accessKey: getEnvOrThrow('BUNNYCDN_ACCESS_KEY'),
      baseUrl: getEnvOrThrow('BUNNYCDN_BASE_URL'),
      pullZoneUrl: getEnvOrThrow('BUNNYCDN_PULL_ZONE_URL'),
    };
  }

  async uploadFile(file: Buffer, options: UploadOptions): Promise<string> {
    const path = options.path
      ? `${options.path}/${options.fileName}`
      : options.fileName;
    const url = `${this.config.baseUrl}/${this.config.storageZoneName}/${path}`;

    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        AccessKey: this.config.accessKey,
        'Content-Type': options.contentType ?? 'application/octet-stream',
      },
      body: file as BodyInit,
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }

    return `${this.config.pullZoneUrl}/${path}`;
  }

  async deleteFile(fileName: string, path?: string): Promise<boolean> {
    const filePath = path ? `${path}/${fileName}` : fileName;
    const url = `${this.config.baseUrl}/${this.config.storageZoneName}/${filePath}`;

    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        AccessKey: this.config.accessKey,
      },
    });

    return response.ok;
  }

  async listFiles(path?: string): Promise<FileListResponse> {
    const url = `${this.config.baseUrl}/${this.config.storageZoneName}/${path ?? ''}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        AccessKey: this.config.accessKey,
      },
    });

    if (!response.ok) {
      throw new Error(`List failed: ${response.statusText}`);
    }

    return response.json() as Promise<FileListResponse>;
  }

  generateFileName(originalName: string): string {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substring(2);
    const extension = originalName.split('.').pop() ?? 'bin';
    return `${timestamp}_${random}.${extension}`;
  }

  getFileUrl(fileName: string, path?: string): string {
    const filePath = path ? `${path}/${fileName}` : fileName;
    return `${this.config.pullZoneUrl}/${filePath}`;
  }
}
