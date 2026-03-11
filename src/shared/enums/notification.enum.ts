/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

export enum NotificationType {
  PUSH = 'PUSH',
  EMAIL = 'EMAIL',
  SMS = 'SMS',
  IN_APP = 'IN_APP',
  WEB_PUSH = 'WEB_PUSH',
  MOBILE_PUSH = 'MOBILE_PUSH',
}

export enum NotificationCategory {
  SYSTEM = 'SYSTEM',
  PROMOTIONAL = 'PROMOTIONAL',
  TRANSACTIONAL = 'TRANSACTIONAL',
  REMINDER = 'REMINDER',
  ALERT = 'ALERT',
  NEWS = 'NEWS',
  SPORTS_UPDATE = 'SPORTS_UPDATE',
  EVENT = 'EVENT',
  MATCH_RESULT = 'MATCH_RESULT',
  BOOKING = 'BOOKING',
  PAYMENT = 'PAYMENT',
  SECURITY = 'SECURITY',
  SOCIAL = 'SOCIAL',
}

export enum NotificationPriority {
  LOW = 'LOW',
  NORMAL = 'NORMAL',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

export enum NotificationStatus {
  PENDING = 'PENDING',
  SENT = 'SENT',
  DELIVERED = 'DELIVERED',
  READ = 'READ',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
}

export enum DeviceType {
  WEB = 'WEB',
  ANDROID = 'ANDROID',
  IOS = 'IOS',
  ALL = 'ALL',
}

export enum NotificationTemplate {
  WELCOME = 'WELCOME',
  VERIFICATION = 'VERIFICATION',
  PASSWORD_RESET = 'PASSWORD_RESET',
  BOOKING_CONFIRMATION = 'BOOKING_CONFIRMATION',
  PAYMENT_SUCCESS = 'PAYMENT_SUCCESS',
  PAYMENT_FAILED = 'PAYMENT_FAILED',
  MATCH_REMINDER = 'MATCH_REMINDER',
  SCORE_UPDATE = 'SCORE_UPDATE',
  EVENT_REMINDER = 'EVENT_REMINDER',
  PROMOTIONAL_OFFER = 'PROMOTIONAL_OFFER',
  CUSTOM = 'CUSTOM',
}

export enum NotificationAction {
  NONE = 'NONE',
  OPEN_APP = 'OPEN_APP',
  OPEN_URL = 'OPEN_URL',
  OPEN_SCREEN = 'OPEN_SCREEN',
  CALL_API = 'CALL_API',
}