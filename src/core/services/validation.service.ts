/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';

/**
 * Validation result interface - Value Object pattern
 */
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Validation Service - Strategy Pattern with Template Method
 * Provides centralized validation logic using class-validator
 * Implements Chain of Responsibility for validation rules
 */
@Injectable()
export class ValidationService {
  /**
   * Template method for object validation
   * Strategy pattern - uses class-validator for validation strategy
   */
  async validateObject(
    dto: unknown,
    dtoClass: new () => object,
  ): Promise<ValidationResult> {
    // Factory pattern - create instance from plain object
    const object = plainToClass(dtoClass, dto);

    // Chain of Responsibility - execute validation chain
    const errors = await validate(object);

    return {
      isValid: errors.length === 0,
      errors: this.extractErrorMessages(errors),
    };
  }

  /**
   * Strategy pattern for email validation
   * Uses regex strategy for email format validation
   */
  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Strategy pattern for password strength validation
   * Implements multiple validation rules using Chain of Responsibility
   */
  validatePasswordStrength(password: string): ValidationResult {
    const errors: string[] = [];

    // Chain of validation rules
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }

    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }

    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }

    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Command pattern for phone number validation
   * Encapsulates phone validation logic
   */
  validatePhoneNumber(phone: string): boolean {
    // Simple international phone number validation
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    return phoneRegex.test(phone.replace(/\s+/g, ''));
  }

  /**
   * Template method for extracting error messages
   * Transforms ValidationError objects into readable strings
   */
  private extractErrorMessages(errors: ValidationError[]): string[] {
    const messages: string[] = [];

    for (const error of errors) {
      if (error.constraints) {
        messages.push(...Object.values(error.constraints));
      }

      // Recursive handling for nested validation errors
      if (error.children?.length) {
        messages.push(...this.extractErrorMessages(error.children));
      }
    }

    return messages;
  }
}
