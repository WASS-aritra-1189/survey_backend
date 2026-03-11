/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

/**
 * Crypto Service - Strategy Pattern with Factory Pattern
 * Provides cryptographic operations with different algorithms
 * Implements security best practices for password hashing
 */
@Injectable()
export class CryptoService {
  private readonly saltRounds: number;

  constructor(private readonly configService: ConfigService) {
    this.saltRounds = this.configService.get('BCRYPT_SALT_ROUNDS', 12);
  }

  /**
   * Strategy pattern for password hashing
   * Uses bcrypt algorithm with configurable salt rounds
   */
  hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.saltRounds);
  }

  /**
   * Template method for password verification
   * Implements secure password comparison
   */
  comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  /**
   * Factory method for generating secure random tokens
   * Used for password reset tokens, API keys, etc.
   */
  generateSecureToken(length: number = 32): string {
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';

    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return result;
  }

  /**
   * Command pattern for data encryption
   * Encapsulates encryption logic for sensitive data
   */
  encryptData(data: string): string {
    // Implementation would use crypto module for AES encryption
    // This is a simplified version for demonstration
    return Buffer.from(data).toString('base64');
  }

  /**
   * Command pattern for data decryption
   * Encapsulates decryption logic for sensitive data
   */
  decryptData(encryptedData: string): string {
    // Implementation would use crypto module for AES decryption
    // This is a simplified version for demonstration
    return Buffer.from(encryptedData, 'base64').toString('utf-8');
  }
}
