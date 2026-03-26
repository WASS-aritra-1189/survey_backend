/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';

// Core modules
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';

// Configuration
import { CacheConfig } from './config/cache.config';
import { DatabaseConfig } from './config/database.config';
import { JwtConfig } from './config/jwt.config';
import { ThrottlerConfig } from './config/throttler.config';

// Feature modules
import { AccountLevelsModule } from './modules/account-levels/account-levels.module';
import { AccountPermissionsModule } from './modules/account-perms/account-permissions.module';
import { AccountModule } from './modules/account/account.module';
import { AuthModule } from './modules/auth/auth.module';
import { BankDetailsModule } from './modules/bank-details/bank-details.module';
import { BlogCommentLikesModule } from './modules/blog-comment-likes/blog-comment-likes.module';
import { BlogCommentsModule } from './modules/blog-comments/blog-comments.module';
import { BlogLikesModule } from './modules/blog-likes/blog-likes.module';
import { BlogSharedModule } from './modules/blog-shared/blog-shared.module';
import { BlogSubCommentLikeModule } from './modules/blog-sub-comment-like/blog-sub-comment-like.module';
import { BlogSubCommentModule } from './modules/blog-sub-comment/blog-sub-comment.module';
import { BlogsModule } from './modules/blogs/blogs.module';
import { CategoryModule } from './modules/category/category.module';
import { CityModule } from './modules/city/city.module';
import { ContactUsHistoryModule } from './modules/contact-us-history/contact-us-history.module';
import { CountryModule } from './modules/country/country.module';
import { DesignationsModule } from './modules/designations/designations.module';
import { EnquiryListModule } from './modules/enquiry-list/enquiry-list.module';
import { FeedbacksModule } from './modules/feedbacks/feedbacks.module';
import { LoginHistoryModule } from './modules/login-history/login-history.module';
import { NewsLettersModule } from './modules/news-letters/news-letters.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { PagesModule } from './modules/pages/pages.module';
import { PasswordHistoryModule } from './modules/password-history/password-history.module';
import { PaymentHistoryModule } from './modules/payment-history/payment-history.module';
import { SettingsModule } from './modules/settings/settings.module';
import { SlidersModule } from './modules/sliders/sliders.module';
import { StaffDetailsModule } from './modules/staff-details/staff-details.module';
import { StateModule } from './modules/state/state.module';
import { SubCategoryModule } from './modules/sub-category/sub-category.module';
import { UploadsModule } from './modules/uploads/uploads.module';
import { UserDetailsModule } from './modules/user-details/user-details.module';
import { UserWalletsModule } from './modules/user-wallets/user-wallets.module';
import { SurveyMasterModule } from './modules/survey-master/survey-master.module';
import { SurveyModule } from './modules/surveys/surveys.module';
import { SurveyResponsesModule } from './modules/survey-responses/survey-responses.module';
import { DevicesModule } from './modules/devices/devices.module';
import { GlobalSearchModule } from './modules/global-search/global-search.module';
import { ReportsModule } from './modules/reports/reports.module';
import { ActivityLogsModule } from './modules/activity-logs/activity-logs.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { ZonesModule } from './modules/zones/zones.module';
import { SurveyTypesModule } from './modules/survey-types/survey-types.module';
import { FaqModule } from './modules/faqs/faqs.module';
import { DownloadHistoryModule } from './modules/download-history/download-history.module';

/**
 * Root Application Module - Module Pattern
 * Implements Dependency Injection and Separation of Concerns
 * Uses Configuration Pattern for environment-specific settings
 */
@Module({
  imports: [
    // Configuration module - Singleton pattern for app-wide config
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
      cache: true, // Cache configuration for performance
    }),

    // Database module - Repository pattern with TypeORM
    TypeOrmModule.forRootAsync({
      useClass: DatabaseConfig,
    }) as never,

    // Cache module - Strategy pattern for different cache stores
    CacheModule.registerAsync({
      useClass: CacheConfig,
      isGlobal: true,
    } as never),

    // Rate limiting - Throttling pattern for API protection
    ThrottlerModule.forRootAsync({
      useClass: ThrottlerConfig,
    } as never),

    // JWT module - Token-based authentication
    JwtModule.registerAsync({
      useClass: JwtConfig,
      global: true,
    } as never),

    // Passport module for authentication strategies
    PassportModule.register({ defaultStrategy: 'jwt' } as never),

    // Core infrastructure modules
    CoreModule,
    SharedModule,

    // Feature modules - Modular architecture
    AuthModule,
    AccountModule,
    AccountPermissionsModule,
    SettingsModule,
    AccountLevelsModule,
    PagesModule,
    UserDetailsModule,
    StaffDetailsModule,
    BankDetailsModule,
    SlidersModule,
    PaymentHistoryModule,
    ContactUsHistoryModule,
    EnquiryListModule,
    NewsLettersModule,
    NotificationsModule,
    LoginHistoryModule,
    DesignationsModule,
    UploadsModule,
    CategoryModule,
    SubCategoryModule,
    CountryModule,
    StateModule,
    CityModule,
    FeedbacksModule,
    BlogsModule,
    BlogLikesModule,
    BlogCommentsModule,
    BlogCommentLikesModule,
    BlogSubCommentModule,
    BlogSubCommentLikeModule,
    BlogSharedModule,
    PasswordHistoryModule,
    UserWalletsModule,
    SurveyMasterModule,
    SurveyModule,
    SurveyResponsesModule,
    DevicesModule,
    GlobalSearchModule,
    ReportsModule,
    ActivityLogsModule,
    DashboardModule,
    ZonesModule,
    SurveyTypesModule,
    FaqModule,
    DownloadHistoryModule,
  ],
})
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class AppModule {}
