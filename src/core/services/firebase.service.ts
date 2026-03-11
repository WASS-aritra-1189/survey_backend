/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseService {
  private readonly logger = new Logger(FirebaseService.name);
  private readonly isEnabled: boolean;

  constructor(private readonly configService: ConfigService) {
    this.isEnabled = this.configService.get<boolean>('FIREBASE_ENABLED', false);
    
    if (this.isEnabled) {
      this.initializeFirebase();
    }
  }

  private initializeFirebase(): void {
    try {
      const serviceAccount = {
        projectId: this.configService.get<string>('FIREBASE_PROJECT_ID'),
        privateKey: this.configService.get<string>('FIREBASE_PRIVATE_KEY')?.replace(/\\n/g, '\n'),
        clientEmail: this.configService.get<string>('FIREBASE_CLIENT_EMAIL'),
      };

      if (!admin.apps.length) {
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
        });
      }
      
      this.logger.log('Firebase initialized successfully');
    } catch (error) {
      this.logger.error('Failed to initialize Firebase:', error);
    }
  }

  async sendNotification(
    tokens: string[],
    title: string,
    body: string,
    data?: Record<string, string>,
    imageUrl?: string,
    actionUrl?: string,
    scheduledTime?: Date,
  ): Promise<{ success: number; failure: number; responses: any[] }> {
    if (!this.isEnabled) {
      this.logger.warn('Firebase is disabled, skipping notification');
      return { success: 0, failure: 0, responses: [] };
    }

    if (!tokens || tokens.length === 0) {
      return { success: 0, failure: 0, responses: [] };
    }

    try {
      const message: admin.messaging.MulticastMessage = {
        tokens,
        notification: {
          title,
          body,
          imageUrl,
        },
        data: data || {},
        webpush: actionUrl ? {
          fcmOptions: {
            link: actionUrl,
          },
        } : undefined,
        android: {
          notification: {
            imageUrl,
            clickAction: actionUrl,
          },
        },
        apns: {
          payload: {
            aps: {
              'mutable-content': 1,
            },
          },
          fcmOptions: {
            imageUrl,
          },
        },
      };

      // Add scheduling if provided
      if (scheduledTime) {
        const sendAtTimestamp = Math.floor(scheduledTime.getTime() / 1000);
        (message as any).fcmOptions = {
          ...((message as any).fcmOptions || {}),
          analyticsLabel: `scheduled_${sendAtTimestamp}`,
        };
        
        // For Android
        if (message.android) {
          message.android.fcmOptions = {
            analyticsLabel: `scheduled_${sendAtTimestamp}`,
          };
        }
        
        // Note: Firebase doesn't support native scheduling in Admin SDK
        // We'll handle this through our cron job
        this.logger.log(`Notification will be processed at ${scheduledTime}`);
      }

      const response = await admin.messaging().sendEachForMulticast(message);
      
      this.logger.log(`Firebase notification sent: ${response.successCount} success, ${response.failureCount} failure`);
      
      return {
        success: response.successCount,
        failure: response.failureCount,
        responses: response.responses,
      };
    } catch (error) {
      this.logger.error('Failed to send Firebase notification:', error);
      throw error;
    }
  }

  async sendScheduledNotification(
    tokens: string[],
    title: string,
    body: string,
    scheduledTime: Date,
    data?: Record<string, string>,
    imageUrl?: string,
    actionUrl?: string,
  ): Promise<{ success: number; failure: number; responses: any[] }> {
    // Use the main sendNotification method with scheduling
    return this.sendNotification(
      tokens,
      title,
      body,
      data,
      imageUrl,
      actionUrl,
      scheduledTime,
    );
  }

  isFirebaseEnabled(): boolean {
    return this.isEnabled;
  }
}