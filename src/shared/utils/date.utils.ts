/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { Injectable } from '@nestjs/common';

/**
 * Date Utilities - Utility Pattern with Static Methods
 * Provides common date manipulation and formatting functions
 * Implements Singleton pattern through NestJS DI
 */
@Injectable()
export class DateUtils {
  /**
   * Strategy pattern for different date formats
   */
  static readonly DATE_FORMATS = {
    ISO: 'YYYY-MM-DD',
    US: 'MM/DD/YYYY',
    EU: 'DD/MM/YYYY',
    TIMESTAMP: 'YYYY-MM-DD HH:mm:ss',
  };

  /**
   * Template method for date formatting
   * Provides consistent date formatting across the application
   */
  formatDate(date: Date, format: string = DateUtils.DATE_FORMATS.ISO): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    // Strategy pattern - different formatting strategies
    switch (format) {
      case DateUtils.DATE_FORMATS.US:
        return `${month}/${day}/${String(year)}`;
      case DateUtils.DATE_FORMATS.EU:
        return `${day}/${month}/${String(year)}`;
      case DateUtils.DATE_FORMATS.TIMESTAMP:
        return `${String(year)}-${month}-${day} ${hours}:${minutes}:${seconds}`;
      default:
        return `${String(year)}-${month}-${day}`;
    }
  }

  /**
   * Command pattern for date calculations
   * Encapsulates date arithmetic operations
   */
  addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  addMonths(date: Date, months: number): Date {
    const result = new Date(date);
    result.setMonth(result.getMonth() + months);
    return result;
  }

  addYears(date: Date, years: number): Date {
    const result = new Date(date);
    result.setFullYear(result.getFullYear() + years);
    return result;
  }

  /**
   * Template method for date difference calculations
   */
  getDaysDifference(startDate: Date, endDate: Date): number {
    const timeDifference = endDate.getTime() - startDate.getTime();
    return Math.ceil(timeDifference / (1000 * 3600 * 24));
  }

  /**
   * Factory method for creating date ranges
   */
  createDateRange(startDate: Date, endDate: Date): Date[] {
    const dates: Date[] = [];
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
  }

  /**
   * Validation method for date ranges
   */
  isValidDateRange(startDate: Date, endDate: Date): boolean {
    return startDate <= endDate;
  }

  /**
   * Utility method for checking if date is in the past
   */
  isPastDate(date: Date): boolean {
    return date < new Date();
  }

  /**
   * Utility method for checking if date is in the future
   */
  isFutureDate(date: Date): boolean {
    return date > new Date();
  }
}
