import { Injectable } from '@angular/core';
import { INotification } from '../notifications/notifications.interface';
import {
  Plugins,
  PushNotification,
  PushNotificationToken,
  PushNotificationActionPerformed
} from '@capacitor/core';

const { PushNotifications } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class CapacitorNotificationsService implements INotification {
  token = '';

  constructor() {
  }

  init(onError?: any): void {
    // Register with Apple / Google to receive push via APNS/FCM
    PushNotifications.requestPermission().then(result => {
      if (result.granted) {
        // Register with Apple / Google to receive push via APNS/FCM
        PushNotifications.register().then();
      } else {
        console.log('Notifications permission not granted');
      }
    });

    // On success, we should be able to receive notifications
    PushNotifications.addListener(
      'registration',
      (token: PushNotificationToken) => {
        this.token = token.value;
        console.log('Push registration success, token: ' + this.token);
      }
    );

    // Some issue with our setup and push will not work
    PushNotifications.addListener('registrationError', (error: any) => {
      onError();
      console.log('REGISTRATION NOTIFICATION ERROR ' + JSON.stringify(error));
    });
  }

  // Method called when notification received
  pushNotificationReceived(callback: any): void {
    PushNotifications.addListener(
      'pushNotificationReceived',
      (notification: PushNotification) => {
        callback(notification);
      }
    );
  }

  // Method called when tapping on a notification
  pushNotificationActionPerformed(callback): void {
    PushNotifications.addListener(
      'pushNotificationActionPerformed',
      (notification: PushNotificationActionPerformed) => {
        callback(notification);
      }
    );
  }

  requestPermission(): Promise<void> {
    return new Promise<void>(async resolve => resolve());
  }
}
