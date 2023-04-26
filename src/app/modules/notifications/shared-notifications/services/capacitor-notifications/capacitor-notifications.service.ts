import { Injectable } from '@angular/core';
import { Notification } from '../notifications/notifications.interface';
import { ActionPerformed, PushNotifications, PushNotificationSchema } from '@capacitor/push-notifications';
import { FCM } from '@capacitor-community/fcm';
@Injectable({
  providedIn: 'root',
})
export class CapacitorNotificationsService implements Notification {
  token = '';
  pushNotifications = PushNotifications;
  firebaseCloudMessaging = FCM;
  constructor() {}

  pushNotificationReceived(callback: any): void {
    this.pushNotifications.addListener('pushNotificationReceived', (notification: PushNotificationSchema) => {
      callback(notification);
    });
  }

  pushNotificationActionPerformed(callback): void {
    this.pushNotifications.addListener('pushNotificationActionPerformed', (notification: ActionPerformed) => {
      callback(notification);
    });
  }

  unsubscribeFrom(aTopic: string): void {
    this.firebaseCloudMessaging.unsubscribeFrom({ topic: aTopic });
  }

  subscribeTo(aTopic: string): void {
    this.firebaseCloudMessaging.subscribeTo({ topic: aTopic });
  }
}
