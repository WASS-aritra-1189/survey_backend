/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

export const MESSAGE_CODES = {
  // Authentication
  AUTH_INVALID_CREDENTIALS: {
    code: 'AUTH_001',
    message: 'Invalid credentials provided',
  },
  AUTH_ACCOUNT_INACTIVE: {
    code: 'AUTH_002',
    message: 'Account is not active',
  },
  AUTH_SYSTEM_INACTIVE: {
    code: 'AUTH_003',
    message: 'System is not active',
  },
  AUTH_INVALID_DOMAIN: {
    code: 'AUTH_004',
    message: 'Invalid domain for user role',
  },
  AUTH_LOGIN_SUCCESS: {
    code: 'AUTH_005',
    message: 'Login successful',
  },
  AUTH_LOGOUT_SUCCESS: {
    code: 'AUTH_006',
    message: 'Logout successful',
  },
  AUTH_TOKEN_INVALID: {
    code: 'AUTH_007',
    message: 'Invalid token format',
  },
  AUTH_TOKEN_REQUIRED: {
    code: 'AUTH_008',
    message: 'Token required',
  },

  // General
  OPERATION_SUCCESS: {
    code: 'GEN_001',
    message: 'Operation completed successfully',
  },
  VALIDATION_ERROR: {
    code: 'GEN_002',
    message: 'Validation failed',
  },
  NOT_FOUND: {
    code: 'GEN_003',
    message: 'Resource not found',
  },
  INTERNAL_ERROR: {
    code: 'GEN_004',
    message: 'Internal server error',
  },
  UNAUTHORIZED: {
    code: 'GEN_005',
    message: 'Unauthorized access',
  },
  FORBIDDEN: {
    code: 'GEN_006',
    message: 'Access forbidden',
  },
  BAD_REQUEST: {
    code: 'GEN_007',
    message: 'Bad request',
  },
  CONFLICT: {
    code: 'GEN_008',
    message: 'Resource conflict',
  },

  // User Management
  USER_CREATED: {
    code: 'USER_001',
    message: 'User created successfully',
  },
  USER_UPDATED: {
    code: 'USER_002',
    message: 'User updated successfully',
  },
  USER_DELETED: {
    code: 'USER_003',
    message: 'User deleted successfully',
  },
  USER_NOT_FOUND: {
    code: 'USER_004',
    message: 'User not found',
  },
  USER_ALREADY_EXISTS: {
    code: 'USER_005',
    message: 'User already exists',
  },
  USER_PROFILE_UPDATED: {
    code: 'USER_006',
    message: 'Profile updated successfully',
  },

  // Data Operations
  DATA_CREATED: {
    code: 'DATA_001',
    message: 'Data created successfully',
  },
  DATA_UPDATED: {
    code: 'DATA_002',
    message: 'Data updated successfully',
  },
  DATA_DELETED: {
    code: 'DATA_003',
    message: 'Data deleted successfully',
  },
  DATA_RETRIEVED: {
    code: 'DATA_004',
    message: 'Data retrieved successfully',
  },
  DATA_IMPORT_SUCCESS: {
    code: 'DATA_005',
    message: 'Data imported successfully',
  },
  DATA_EXPORT_SUCCESS: {
    code: 'DATA_006',
    message: 'Data exported successfully',
  },

  // File Operations
  FILE_UPLOADED: {
    code: 'FILE_001',
    message: 'File uploaded successfully',
  },
  FILE_DELETED: {
    code: 'FILE_002',
    message: 'File deleted successfully',
  },
  FILE_NOT_FOUND: {
    code: 'FILE_003',
    message: 'File not found',
  },
  FILE_TOO_LARGE: {
    code: 'FILE_004',
    message: 'File size exceeds limit',
  },
  FILE_INVALID_TYPE: {
    code: 'FILE_005',
    message: 'Invalid file type',
  },

  // Email/Notification
  EMAIL_SENT: {
    code: 'EMAIL_001',
    message: 'Email sent successfully',
  },
  EMAIL_FAILED: {
    code: 'EMAIL_002',
    message: 'Failed to send email',
  },
  NOTIFICATION_SENT: {
    code: 'NOTIF_001',
    message: 'Notification sent successfully',
  },

  // Password/Security
  PASSWORD_CHANGED: {
    code: 'PWD_001',
    message: 'Password changed successfully',
  },
  PASSWORD_RESET_SENT: {
    code: 'PWD_002',
    message: 'Password reset link sent',
  },
  PASSWORD_INVALID: {
    code: 'PWD_003',
    message: 'Invalid password',
  },
  PASSWORD_WEAK: {
    code: 'PWD_004',
    message: 'Password does not meet requirements',
  },

  // System/Configuration
  SYSTEM_MAINTENANCE: {
    code: 'SYS_001',
    message: 'System under maintenance',
  },
  FEATURE_DISABLED: {
    code: 'SYS_002',
    message: 'Feature is currently disabled',
  },
  RATE_LIMIT_EXCEEDED: {
    code: 'SYS_003',
    message: 'Rate limit exceeded',
  },
  SERVICE_UNAVAILABLE: {
    code: 'SYS_004',
    message: 'Service temporarily unavailable',
  },

  // Payment/Billing
  PAYMENT_SUCCESS: {
    code: 'PAY_001',
    message: 'Payment processed successfully',
  },
  PAYMENT_FAILED: {
    code: 'PAY_002',
    message: 'Payment processing failed',
  },
  PAYMENT_CANCELLED: {
    code: 'PAY_003',
    message: 'Payment cancelled by user',
  },
  PAYMENT_REFUNDED: {
    code: 'PAY_004',
    message: 'Payment refunded successfully',
  },
  INSUFFICIENT_FUNDS: {
    code: 'PAY_005',
    message: 'Insufficient funds',
  },
  SUBSCRIPTION_CREATED: {
    code: 'SUB_001',
    message: 'Subscription created successfully',
  },
  SUBSCRIPTION_CANCELLED: {
    code: 'SUB_002',
    message: 'Subscription cancelled',
  },
  SUBSCRIPTION_EXPIRED: {
    code: 'SUB_003',
    message: 'Subscription has expired',
  },

  // E-commerce
  PRODUCT_ADDED: {
    code: 'PROD_001',
    message: 'Product added successfully',
  },
  PRODUCT_OUT_OF_STOCK: {
    code: 'PROD_002',
    message: 'Product is out of stock',
  },
  CART_ITEM_ADDED: {
    code: 'CART_001',
    message: 'Item added to cart',
  },
  CART_ITEM_REMOVED: {
    code: 'CART_002',
    message: 'Item removed from cart',
  },
  CART_CLEARED: {
    code: 'CART_003',
    message: 'Cart cleared successfully',
  },
  ORDER_PLACED: {
    code: 'ORDER_001',
    message: 'Order placed successfully',
  },
  ORDER_CANCELLED: {
    code: 'ORDER_002',
    message: 'Order cancelled',
  },
  ORDER_SHIPPED: {
    code: 'ORDER_003',
    message: 'Order shipped',
  },
  ORDER_DELIVERED: {
    code: 'ORDER_004',
    message: 'Order delivered',
  },
  WISHLIST_ADDED: {
    code: 'WISH_001',
    message: 'Item added to wishlist',
  },
  COUPON_APPLIED: {
    code: 'COUP_001',
    message: 'Coupon applied successfully',
  },
  COUPON_INVALID: {
    code: 'COUP_002',
    message: 'Invalid or expired coupon',
  },

  // Gaming
  GAME_STARTED: {
    code: 'GAME_001',
    message: 'Game started successfully',
  },
  GAME_ENDED: {
    code: 'GAME_002',
    message: 'Game ended',
  },
  GAME_PAUSED: {
    code: 'GAME_003',
    message: 'Game paused',
  },
  LEVEL_COMPLETED: {
    code: 'GAME_004',
    message: 'Level completed',
  },
  ACHIEVEMENT_UNLOCKED: {
    code: 'GAME_005',
    message: 'Achievement unlocked',
  },
  SCORE_SAVED: {
    code: 'GAME_006',
    message: 'Score saved successfully',
  },
  LEADERBOARD_UPDATED: {
    code: 'GAME_007',
    message: 'Leaderboard updated',
  },
  PLAYER_JOINED: {
    code: 'GAME_008',
    message: 'Player joined the game',
  },
  PLAYER_LEFT: {
    code: 'GAME_009',
    message: 'Player left the game',
  },
  MATCH_FOUND: {
    code: 'MATCH_001',
    message: 'Match found',
  },
  MATCH_CANCELLED: {
    code: 'MATCH_002',
    message: 'Match cancelled',
  },

  // Sports
  TEAM_CREATED: {
    code: 'TEAM_001',
    message: 'Team created successfully',
  },
  TEAM_JOINED: {
    code: 'TEAM_002',
    message: 'Joined team successfully',
  },
  TEAM_LEFT: {
    code: 'TEAM_003',
    message: 'Left team successfully',
  },
  TOURNAMENT_REGISTERED: {
    code: 'TOUR_001',
    message: 'Registered for tournament',
  },
  TOURNAMENT_STARTED: {
    code: 'TOUR_002',
    message: 'Tournament started',
  },
  TOURNAMENT_ENDED: {
    code: 'TOUR_003',
    message: 'Tournament ended',
  },
  MATCH_SCHEDULED: {
    code: 'SPORT_001',
    message: 'Match scheduled successfully',
  },
  MATCH_RESULT_UPDATED: {
    code: 'SPORT_002',
    message: 'Match result updated',
  },
  SEASON_STARTED: {
    code: 'SPORT_003',
    message: 'Season started',
  },
  SEASON_ENDED: {
    code: 'SPORT_004',
    message: 'Season ended',
  },

  // Social/Community
  FRIEND_REQUEST_SENT: {
    code: 'SOCIAL_001',
    message: 'Friend request sent',
  },
  FRIEND_REQUEST_ACCEPTED: {
    code: 'SOCIAL_002',
    message: 'Friend request accepted',
  },
  FRIEND_REMOVED: {
    code: 'SOCIAL_003',
    message: 'Friend removed',
  },
  MESSAGE_SENT: {
    code: 'MSG_001',
    message: 'Message sent successfully',
  },
  POST_CREATED: {
    code: 'POST_001',
    message: 'Post created successfully',
  },
  POST_LIKED: {
    code: 'POST_002',
    message: 'Post liked',
  },
  COMMENT_ADDED: {
    code: 'COMM_001',
    message: 'Comment added successfully',
  },
  FOLLOW_SUCCESS: {
    code: 'FOLLOW_001',
    message: 'Following user successfully',
  },
  UNFOLLOW_SUCCESS: {
    code: 'FOLLOW_002',
    message: 'Unfollowed user successfully',
  },

  // Content Management
  CONTENT_PUBLISHED: {
    code: 'CONT_001',
    message: 'Content published successfully',
  },
  CONTENT_DRAFT_SAVED: {
    code: 'CONT_002',
    message: 'Draft saved successfully',
  },
  CONTENT_ARCHIVED: {
    code: 'CONT_003',
    message: 'Content archived',
  },
  CONTENT_MODERATED: {
    code: 'CONT_004',
    message: 'Content moderated',
  },
  CONTENT_REPORTED: {
    code: 'CONT_005',
    message: 'Content reported successfully',
  },

  // Booking/Reservation
  BOOKING_CONFIRMED: {
    code: 'BOOK_001',
    message: 'Booking confirmed successfully',
  },
  BOOKING_CANCELLED: {
    code: 'BOOK_002',
    message: 'Booking cancelled',
  },
  BOOKING_MODIFIED: {
    code: 'BOOK_003',
    message: 'Booking modified successfully',
  },
  SLOT_UNAVAILABLE: {
    code: 'BOOK_004',
    message: 'Selected slot is unavailable',
  },
  WAITLIST_ADDED: {
    code: 'BOOK_005',
    message: 'Added to waitlist',
  },

  // Analytics/Reporting
  REPORT_GENERATED: {
    code: 'RPT_001',
    message: 'Report generated successfully',
  },
  ANALYTICS_UPDATED: {
    code: 'ANLY_001',
    message: 'Analytics data updated',
  },
  STATS_CALCULATED: {
    code: 'STAT_001',
    message: 'Statistics calculated',
  },

  // Inventory/Stock
  INVENTORY_UPDATED: {
    code: 'INV_001',
    message: 'Inventory updated successfully',
  },
  STOCK_ALERT: {
    code: 'INV_002',
    message: 'Low stock alert',
  },
  RESTOCK_COMPLETED: {
    code: 'INV_003',
    message: 'Restocking completed',
  },

  // Reviews/Ratings
  REVIEW_SUBMITTED: {
    code: 'REV_001',
    message: 'Review submitted successfully',
  },
  RATING_UPDATED: {
    code: 'REV_002',
    message: 'Rating updated successfully',
  },
  REVIEW_MODERATED: {
    code: 'REV_003',
    message: 'Review moderated',
  },

  // API/Integration
  API_KEY_INVALID: {
    code: 'API_001',
    message: 'Invalid API key provided',
  },
  API_QUOTA_EXCEEDED: {
    code: 'API_002',
    message: 'API quota limit exceeded',
  },
  WEBHOOK_DELIVERED: {
    code: 'API_003',
    message: 'Webhook delivered successfully',
  },
  INTEGRATION_CONNECTED: {
    code: 'API_004',
    message: 'Third-party integration connected',
  },
  SYNC_COMPLETED: {
    code: 'API_005',
    message: 'Data synchronization completed',
  },

  // Database/Storage
  DATABASE_CONNECTION_FAILED: {
    code: 'DB_001',
    message: 'Database connection failed',
  },
  BACKUP_CREATED: {
    code: 'DB_002',
    message: 'Database backup created successfully',
  },
  MIGRATION_COMPLETED: {
    code: 'DB_003',
    message: 'Database migration completed',
  },
  STORAGE_QUOTA_EXCEEDED: {
    code: 'STOR_001',
    message: 'Storage quota limit exceeded',
  },
  CACHE_CLEARED: {
    code: 'CACHE_001',
    message: 'Cache cleared successfully',
  },

  // Permissions/Roles
  PERMISSION_GRANTED: {
    code: 'PERM_001',
    message: 'Permission granted successfully',
  },
  PERMISSION_DENIED: {
    code: 'PERM_002',
    message: 'Permission denied for this action',
  },
  ROLE_ASSIGNED: {
    code: 'ROLE_001',
    message: 'Role assigned to user successfully',
  },
  ROLE_REMOVED: {
    code: 'ROLE_002',
    message: 'Role removed from user',
  },
  ACCESS_LEVEL_CHANGED: {
    code: 'ROLE_003',
    message: 'User access level updated',
  },

  // Verification/KYC
  ACCOUNT_VERIFIED: {
    code: 'VERIFY_001',
    message: 'Account verification completed',
  },
  DOCUMENT_UPLOADED: {
    code: 'VERIFY_002',
    message: 'Verification document uploaded',
  },
  IDENTITY_CONFIRMED: {
    code: 'VERIFY_003',
    message: 'Identity verification successful',
  },
  VERIFICATION_PENDING: {
    code: 'VERIFY_004',
    message: 'Verification is under review',
  },
  VERIFICATION_REJECTED: {
    code: 'VERIFY_005',
    message: 'Verification documents rejected',
  },

  // Communication/Messaging
  SMS_SENT: {
    code: 'SMS_001',
    message: 'SMS sent successfully',
  },
  PUSH_NOTIFICATION_SENT: {
    code: 'PUSH_001',
    message: 'Push notification delivered',
  },
  CHAT_MESSAGE_DELIVERED: {
    code: 'CHAT_001',
    message: 'Chat message delivered',
  },
  VIDEO_CALL_STARTED: {
    code: 'CALL_001',
    message: 'Video call initiated',
  },
  CONFERENCE_JOINED: {
    code: 'CONF_001',
    message: 'Joined conference successfully',
  },

  // Learning/Education
  COURSE_ENROLLED: {
    code: 'EDU_001',
    message: 'Successfully enrolled in course',
  },
  LESSON_COMPLETED: {
    code: 'EDU_002',
    message: 'Lesson marked as completed',
  },
  QUIZ_SUBMITTED: {
    code: 'EDU_003',
    message: 'Quiz submitted successfully',
  },
  CERTIFICATE_EARNED: {
    code: 'EDU_004',
    message: 'Certificate earned for completion',
  },
  ASSIGNMENT_GRADED: {
    code: 'EDU_005',
    message: 'Assignment has been graded',
  },

  // Health/Fitness
  WORKOUT_COMPLETED: {
    code: 'FIT_001',
    message: 'Workout session completed',
  },
  GOAL_ACHIEVED: {
    code: 'FIT_002',
    message: 'Fitness goal achieved',
  },
  HEALTH_DATA_SYNCED: {
    code: 'HEALTH_001',
    message: 'Health data synchronized',
  },
  APPOINTMENT_SCHEDULED: {
    code: 'HEALTH_002',
    message: 'Medical appointment scheduled',
  },
  MEDICATION_REMINDER: {
    code: 'HEALTH_003',
    message: 'Medication reminder set',
  },

  // Travel/Transportation
  TRIP_BOOKED: {
    code: 'TRAVEL_001',
    message: 'Trip booked successfully',
  },
  FLIGHT_DELAYED: {
    code: 'TRAVEL_002',
    message: 'Flight has been delayed',
  },
  HOTEL_RESERVED: {
    code: 'TRAVEL_003',
    message: 'Hotel reservation confirmed',
  },
  RIDE_REQUESTED: {
    code: 'RIDE_001',
    message: 'Ride request submitted',
  },
  DRIVER_ASSIGNED: {
    code: 'RIDE_002',
    message: 'Driver assigned to your ride',
  },
  TRIP_COMPLETED: {
    code: 'RIDE_003',
    message: 'Trip completed successfully',
  },

  // Financial/Banking
  TRANSACTION_COMPLETED: {
    code: 'FIN_001',
    message: 'Financial transaction completed',
  },
  TRANSFER_INITIATED: {
    code: 'FIN_002',
    message: 'Money transfer initiated',
  },
  ACCOUNT_FROZEN: {
    code: 'FIN_003',
    message: 'Account has been frozen',
  },
  CREDIT_APPROVED: {
    code: 'FIN_004',
    message: 'Credit application approved',
  },
  LOAN_DISBURSED: {
    code: 'FIN_005',
    message: 'Loan amount disbursed',
  },
  INVESTMENT_EXECUTED: {
    code: 'FIN_006',
    message: 'Investment order executed',
  },

  // Real Estate/Property
  PROPERTY_LISTED: {
    code: 'PROP_001',
    message: 'Property listed successfully',
  },
  VIEWING_SCHEDULED: {
    code: 'PROP_002',
    message: 'Property viewing scheduled',
  },
  OFFER_SUBMITTED: {
    code: 'PROP_003',
    message: 'Property offer submitted',
  },
  LEASE_SIGNED: {
    code: 'PROP_004',
    message: 'Lease agreement signed',
  },
  RENT_COLLECTED: {
    code: 'PROP_005',
    message: 'Rent payment collected',
  },

  // Events/Entertainment
  EVENT_CREATED: {
    code: 'EVENT_001',
    message: 'Event created successfully',
  },
  TICKET_PURCHASED: {
    code: 'EVENT_002',
    message: 'Event ticket purchased',
  },
  EVENT_CANCELLED: {
    code: 'EVENT_003',
    message: 'Event has been cancelled',
  },
  RSVP_CONFIRMED: {
    code: 'EVENT_004',
    message: 'RSVP confirmed for event',
  },
  LIVESTREAM_STARTED: {
    code: 'STREAM_001',
    message: 'Live stream has started',
  },

  // IoT/Smart Devices
  DEVICE_CONNECTED: {
    code: 'IOT_001',
    message: 'Smart device connected',
  },
  SENSOR_ALERT: {
    code: 'IOT_002',
    message: 'Sensor threshold exceeded',
  },
  AUTOMATION_TRIGGERED: {
    code: 'IOT_003',
    message: 'Home automation rule triggered',
  },
  FIRMWARE_UPDATED: {
    code: 'IOT_004',
    message: 'Device firmware updated',
  },

  // Compliance/Legal
  GDPR_CONSENT_RECORDED: {
    code: 'LEGAL_001',
    message: 'GDPR consent preferences saved',
  },
  AUDIT_LOG_CREATED: {
    code: 'LEGAL_002',
    message: 'Audit trail entry created',
  },
  TERMS_ACCEPTED: {
    code: 'LEGAL_003',
    message: 'Terms and conditions accepted',
  },
  DATA_RETENTION_APPLIED: {
    code: 'LEGAL_004',
    message: 'Data retention policy applied',
  },

  // Monitoring/Alerts
  SYSTEM_ALERT_TRIGGERED: {
    code: 'ALERT_001',
    message: 'System alert has been triggered',
  },
  PERFORMANCE_DEGRADED: {
    code: 'ALERT_002',
    message: 'System performance degradation detected',
  },
  SECURITY_BREACH_DETECTED: {
    code: 'ALERT_003',
    message: 'Potential security breach detected',
  },
  UPTIME_RESTORED: {
    code: 'ALERT_004',
    message: 'System uptime restored',
  },

  // Localization/Multi-language
  LANGUAGE_CHANGED: {
    code: 'LOCALE_001',
    message: 'Language preference updated',
  },
  TIMEZONE_UPDATED: {
    code: 'LOCALE_002',
    message: 'Timezone setting updated',
  },
  CURRENCY_CONVERTED: {
    code: 'LOCALE_003',
    message: 'Currency conversion completed',
  },

  // Designations Module
  DESIGNATION_NOT_FOUND: {
    code: 'DESIGNATION_001',
    message: 'Designation not found',
  },
  DESIGNATION_NAME_DUPLICATE: {
    code: 'DESIGNATION_002',
    message: 'Designation with this name already exists',
  },
  DESIGNATION_CREATION_FAILED: {
    code: 'DESIGNATION_003',
    message: 'Failed to create designation',
  },
  DESIGNATION_UPDATE_FAILED: {
    code: 'DESIGNATION_004',
    message: 'Failed to update designation',
  },
  DESIGNATION_DELETE_FAILED: {
    code: 'DESIGNATION_005',
    message: 'Failed to delete designation',
  },
  DESIGNATION_INVALID_STATUS: {
    code: 'DESIGNATION_006',
    message: 'Invalid designation status provided',
  },
  DESIGNATION_CACHE_ERROR: {
    code: 'DESIGNATION_007',
    message: 'Designation cache operation failed',
  },

  // Pages Module
  PAGE_NOT_FOUND: {
    code: 'PAGE_001',
    message: 'Page not found',
  },
  PAGE_ALREADY_EXISTS: {
    code: 'PAGE_002',
    message: 'Page already exists',
  },
  PAGE_SLUG_DUPLICATE: {
    code: 'PAGE_003',
    message: 'Page with this slug already exists',
  },
  PAGE_TITLE_DUPLICATE: {
    code: 'PAGE_004',
    message: 'Page with this title already exists',
  },
  PAGE_INVALID_TYPE: {
    code: 'PAGE_005',
    message: 'Invalid page type provided',
  },
  PAGE_INVALID_STATUS: {
    code: 'PAGE_006',
    message: 'Invalid page status provided',
  },
  PAGE_CREATION_FAILED: {
    code: 'PAGE_007',
    message: 'Failed to create page',
  },
  PAGE_UPDATE_FAILED: {
    code: 'PAGE_008',
    message: 'Failed to update page',
  },
  PAGE_DELETE_FAILED: {
    code: 'PAGE_009',
    message: 'Failed to delete page',
  },
  PAGE_CACHE_ERROR: {
    code: 'PAGE_010',
    message: 'Page cache operation failed',
  },

  // General Database Errors
  DB_CONNECTION_ERROR: {
    code: 'DB_001',
    message: 'Database connection error',
  },
  DB_QUERY_ERROR: {
    code: 'DB_002',
    message: 'Database query execution failed',
  },
  DB_TRANSACTION_ERROR: {
    code: 'DB_003',
    message: 'Database transaction failed',
  },
  DB_CONSTRAINT_VIOLATION: {
    code: 'DB_004',
    message: 'Database constraint violation',
  },

  // Validation Errors
  VALIDATION_REQUIRED_FIELD: {
    code: 'VAL_001',
    message: 'Required field is missing',
  },
  VALIDATION_INVALID_FORMAT: {
    code: 'VAL_002',
    message: 'Invalid data format',
  },
  VALIDATION_LENGTH_EXCEEDED: {
    code: 'VAL_003',
    message: 'Data length exceeds maximum allowed',
  },
  VALIDATION_INVALID_UUID: {
    code: 'VAL_004',
    message: 'Invalid UUID format',
  },

  // Cache Errors
  CACHE_CONNECTION_ERROR: {
    code: 'CACHE_001',
    message: 'Cache connection error',
  },
  CACHE_SET_ERROR: {
    code: 'CACHE_002',
    message: 'Failed to set cache value',
  },
  CACHE_GET_ERROR: {
    code: 'CACHE_003',
    message: 'Failed to get cache value',
  },
  CACHE_DELETE_ERROR: {
    code: 'CACHE_004',
    message: 'Failed to delete cache value',
  },
  CACHE_CLEAR_ERROR: {
    code: 'CACHE_005',
    message: 'Failed to clear cache',
  },

  // Settings Module
  SETTING_NOT_FOUND: {
    code: 'SETTING_001',
    message: 'Setting not found',
  },
  SETTING_DOMAIN_NOT_FOUND: {
    code: 'SETTING_002',
    message: 'Setting not found for domain',
  },

  // Sliders Module
  SLIDER_NOT_FOUND: {
    code: 'SLIDER_001',
    message: 'Slider not found',
  },
  SLIDER_CREATION_FAILED: {
    code: 'SLIDER_002',
    message: 'Failed to create slider',
  },
  SLIDER_UPDATE_FAILED: {
    code: 'SLIDER_003',
    message: 'Failed to update slider',
  },
  SLIDER_DELETE_FAILED: {
    code: 'SLIDER_004',
    message: 'Failed to delete slider',
  },
  SLIDER_INVALID_STATUS: {
    code: 'SLIDER_005',
    message: 'Invalid slider status provided',
  },
  SLIDER_BULK_UPDATE_FAILED: {
    code: 'SLIDER_006',
    message: 'Bulk update operation failed',
  },

  // Category Module
  CATEGORY_NOT_FOUND: {
    code: 'CATEGORY_001',
    message: 'Category not found',
  },
  CATEGORY_NAME_DUPLICATE: {
    code: 'CATEGORY_002',
    message: 'Category with this name already exists',
  },

  // Sub-Category Module
  SUB_CATEGORY_NOT_FOUND: {
    code: 'SUB_CATEGORY_001',
    message: 'Sub-category not found',
  },
  SUB_CATEGORY_NAME_DUPLICATE: {
    code: 'SUB_CATEGORY_002',
    message: 'Sub-category with this name already exists',
  },

  // Country Module
  COUNTRY_NOT_FOUND: {
    code: 'COUNTRY_001',
    message: 'Country not found',
  },
  COUNTRY_NAME_DUPLICATE: {
    code: 'COUNTRY_002',
    message: 'Country with this name already exists',
  },
  COUNTRY_CODE_DUPLICATE: {
    code: 'COUNTRY_003',
    message: 'Country with this code already exists',
  },

  // State Module
  STATE_NOT_FOUND: {
    code: 'STATE_001',
    message: 'State not found',
  },
  STATE_NAME_DUPLICATE: {
    code: 'STATE_002',
    message: 'State with this name already exists in this country',
  },

  // City Module
  CITY_NOT_FOUND: {
    code: 'CITY_001',
    message: 'City not found',
  },
  CITY_NAME_DUPLICATE: {
    code: 'CITY_002',
    message: 'City with this name already exists in this state',
  },

  // Blog Module
  BLOG_NOT_FOUND: {
    code: 'BLOG_001',
    message: 'Blog not found',
  },
  BLOG_SLUG_DUPLICATE: {
    code: 'BLOG_002',
    message: 'Blog with this slug already exists',
  },
  BLOG_TITLE_DUPLICATE: {
    code: 'BLOG_003',
    message: 'Blog with this title already exists',
  },
  BLOG_CREATION_FAILED: {
    code: 'BLOG_004',
    message: 'Failed to create blog',
  },
  BLOG_UPDATE_FAILED: {
    code: 'BLOG_005',
    message: 'Failed to update blog',
  },
  BLOG_DELETE_FAILED: {
    code: 'BLOG_006',
    message: 'Failed to delete blog',
  },
  BLOG_INVALID_STATUS: {
    code: 'BLOG_007',
    message: 'Invalid blog status provided',
  },
  BLOG_PUBLISH_FAILED: {
    code: 'BLOG_008',
    message: 'Failed to publish blog',
  },
  BLOG_CACHE_ERROR: {
    code: 'BLOG_009',
    message: 'Blog cache operation failed',
  },

  // Blog Comment Module
  BLOG_COMMENT_NOT_FOUND: {
    code: 'BLOG_COMMENT_001',
    message: 'Blog comment not found',
  },
  BLOG_COMMENT_CREATION_FAILED: {
    code: 'BLOG_COMMENT_002',
    message: 'Failed to create blog comment',
  },
  BLOG_COMMENT_UPDATE_FAILED: {
    code: 'BLOG_COMMENT_003',
    message: 'Failed to update blog comment',
  },
  BLOG_COMMENT_DELETE_FAILED: {
    code: 'BLOG_COMMENT_004',
    message: 'Failed to delete blog comment',
  },
  BLOG_COMMENT_INVALID_STATUS: {
    code: 'BLOG_COMMENT_005',
    message: 'Invalid blog comment status provided',
  },
  BLOG_COMMENT_CACHE_ERROR: {
    code: 'BLOG_COMMENT_006',
    message: 'Blog comment cache operation failed',
  },
  BLOG_COMMENT_UPDATE_TIME_EXPIRED: {
    code: 'BLOG_COMMENT_007',
    message: 'Comment can only be updated within 10 minutes of creation',
  },

  // Blog Like Module
  BLOG_LIKE_NOT_FOUND: {
    code: 'BLOG_LIKE_001',
    message: 'Blog like not found',
  },
  BLOG_LIKE_ALREADY_EXISTS: {
    code: 'BLOG_LIKE_002',
    message: 'Blog already liked by this user',
  },
  BLOG_LIKE_CREATION_FAILED: {
    code: 'BLOG_LIKE_003',
    message: 'Failed to create blog like',
  },
  BLOG_LIKE_DELETE_FAILED: {
    code: 'BLOG_LIKE_004',
    message: 'Failed to delete blog like',
  },
  BLOG_LIKE_CACHE_ERROR: {
    code: 'BLOG_LIKE_005',
    message: 'Blog like cache operation failed',
  },

  // Blog Shared Module
  BLOG_SHARED_NOT_FOUND: {
    code: 'BLOG_SHARED_001',
    message: 'Blog share record not found',
  },
  BLOG_SHARED_CREATION_FAILED: {
    code: 'BLOG_SHARED_002',
    message: 'Failed to record blog share',
  },
  BLOG_SHARED_CACHE_ERROR: {
    code: 'BLOG_SHARED_003',
    message: 'Blog shared cache operation failed',
  },

  // Blog Sub Comment Module
  BLOG_SUB_COMMENT_NOT_FOUND: {
    code: 'BLOG_SUB_COMMENT_001',
    message: 'Blog sub-comment not found',
  },
  BLOG_SUB_COMMENT_CREATION_FAILED: {
    code: 'BLOG_SUB_COMMENT_002',
    message: 'Failed to create blog sub-comment',
  },
  BLOG_SUB_COMMENT_UPDATE_FAILED: {
    code: 'BLOG_SUB_COMMENT_003',
    message: 'Failed to update blog sub-comment',
  },
  BLOG_SUB_COMMENT_DELETE_FAILED: {
    code: 'BLOG_SUB_COMMENT_004',
    message: 'Failed to delete blog sub-comment',
  },
  BLOG_SUB_COMMENT_INVALID_STATUS: {
    code: 'BLOG_SUB_COMMENT_005',
    message: 'Invalid blog sub-comment status provided',
  },
  BLOG_SUB_COMMENT_CACHE_ERROR: {
    code: 'BLOG_SUB_COMMENT_006',
    message: 'Blog sub-comment cache operation failed',
  },

  // Blog Sub Comment Like Module
  BLOG_SUB_COMMENT_LIKE_NOT_FOUND: {
    code: 'BLOG_SUB_COMMENT_LIKE_001',
    message: 'Blog sub-comment like not found',
  },
  BLOG_SUB_COMMENT_LIKE_ALREADY_EXISTS: {
    code: 'BLOG_SUB_COMMENT_LIKE_002',
    message: 'Sub-comment already liked by this user',
  },
  BLOG_SUB_COMMENT_LIKE_CREATION_FAILED: {
    code: 'BLOG_SUB_COMMENT_LIKE_003',
    message: 'Failed to create sub-comment like',
  },
  BLOG_SUB_COMMENT_LIKE_DELETE_FAILED: {
    code: 'BLOG_SUB_COMMENT_LIKE_004',
    message: 'Failed to delete sub-comment like',
  },
  BLOG_SUB_COMMENT_LIKE_CACHE_ERROR: {
    code: 'BLOG_SUB_COMMENT_LIKE_005',
    message: 'Sub-comment like cache operation failed',
  },

  // Survey Module
  SURVEY_LIMIT_EXCEEDED: {
    code: 'SURVEY_001',
    message: 'Survey master has reached their survey limit',
  },
  BULK_ASSIGN_FAILED: {
    code: 'SURVEY_002',
    message: 'Bulk assignment failed', 
  },
  SURVEY_INACTIVE: {
    code: 'SURVEY_003',
    message: 'Survey is not active',
  },
  SURVEY_MASTER_INACTIVE: {
    code: 'SURVEY_004',
    message: 'Survey master is not active',
  },
  SURVEY_NOT_ASSIGNED: {
    code: 'SURVEY_005',
    message: 'Survey is not assigned to this survey master',
  },
} as const;
