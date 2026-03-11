/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

export enum SubscriptionStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  UNSUBSCRIBED = 'UNSUBSCRIBED',
  BOUNCED = 'BOUNCED',
  PENDING_CONFIRMATION = 'PENDING_CONFIRMATION',
}

export enum NewsletterCategory {
  GENERAL = 'GENERAL',
  SPORTS = 'SPORTS',
  PROMOTIONS = 'PROMOTIONS',
  UPDATES = 'UPDATES',
  EVENTS = 'EVENTS',
  WEEKLY_DIGEST = 'WEEKLY_DIGEST',
  MONTHLY_SUMMARY = 'MONTHLY_SUMMARY',
}

export enum EmailFrequency {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  QUARTERLY = 'QUARTERLY',
}