/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import * as path from 'node:path';

import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseCloudMessagingService {
  constructor() {
    const serviceAccountPath = path.resolve(
      __dirname,
      '../../../vermelha-88923-firebase-adminsdk-dz0c7-e4e3f671f9.json',
    );

    if (admin.apps.length === 0) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccountPath),
        storageBucket: process.env.STORAGE_BUCKET,
      });
    }
  }

  async subscribeToTopic(token: string, topic: string): Promise<void> {
    try {
      const response = await admin.messaging().subscribeToTopic(token, topic);
      console.log('Successfully subscribed to topic:', response);
    } catch (error) {
      throw new Error('Faild to subscribe topic: ', error);
    }
  }

  async subscribeMultipleToTopic(
    tokens: string[],
    topic: string,
  ): Promise<void> {
    try {
      const response = await admin.messaging().subscribeToTopic(tokens, topic);
      console.log(
        'Successfully subscribed multiple devices to topic:',
        response,
      );
    } catch (error) {
      throw new Error('Faild to subscribe multiple devices to topic: ', error);
    }
  }

  async unsubscribeToTopic(token: string, topic: string): Promise<void> {
    try {
      const response = await admin
        .messaging()
        .unsubscribeFromTopic(token, topic);
      console.log('Successfully unsubscribed from topic:', response);
    } catch (error) {
      throw new Error('Failed to unsubscribe from topic: ' + error);
    }
  }

  async unsubscribeMultipleToTopic(
    tokens: string[],
    topic: string,
  ): Promise<void> {
    try {
      const response = await admin
        .messaging()
        .unsubscribeFromTopic(tokens, topic);
      console.log(
        'Successfully unsubscribed multiple devices from topic:',
        response,
      );
    } catch (error) {
      throw new Error(
        'Failed to unsubscribe multiple devices from topic: ' + error,
      );
    }
  }

  async sendNotificationToTopic(
    topic: string,
    title: string,
    body: string,
    data?: any,
  ): Promise<void> {
    const message = {
      notification: {
        title,
        body,
      },
      data: data || {},
      topic,
    };

    try {
      const response = await admin.messaging().send(message);
      console.log(`Successfully sent message to topic: ${response}`);
    } catch (error) {
      throw new Error('Faild to send message to topic: ', error);
    }
  }

  async sendNotificationToDevices(
    registrationTokens: string[],
    title: string,
    body: string,
    data?: any,
  ): Promise<void> {
    const message = {
      notification: {
        title,
        body,
      },
      data: data || {},
      tokens: registrationTokens,
    };

    try {
      for (const token of registrationTokens) {
        console.log(token);
      }

      const response = await admin.messaging().sendEachForMulticast(message);
      console.log(
        `Successfully sent message to devices: ${response.successCount} messages sent`,
      );

      if (response.failureCount > 0) {
        console.error(
          'Failed to send some messages:',
          response.responses.filter((r) => !r.success),
        );
      }
    } catch (error) {
      throw new Error('Failed to send message to devices: ' + error);
    }
  }
}
