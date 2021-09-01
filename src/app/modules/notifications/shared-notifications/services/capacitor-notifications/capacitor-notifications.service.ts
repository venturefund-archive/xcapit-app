import { Injectable } from '@angular/core';
import { INotification } from '../notifications/notifications.interface';
import { Plugins, PushNotification, PushNotificationToken, PushNotificationActionPerformed } from '@capacitor/core';

@Injectable({
  providedIn: 'root',
})
export class CapacitorNotificationsService implements INotification {
  token = '';
  pushNotifications = Plugins.PushNotifications;

  constructor() {}

  init(onError?: any): void {
    // Register with Apple / Google to receive push via APNS/FCM
    this.pushNotifications.requestPermission().then((result) => {
      if (result.granted) {
        // Register with Apple / Google to receive push via APNS/FCM
        this.pushNotifications.register();
      } else {
        console.log('Notifications permission not granted');
      }
    });

    // On success, we should be able to receive notifications
    this.pushNotifications.addListener('registration', (token: PushNotificationToken) => {
      this.token = token.value;
      console.log('Push registration success, token: ' + this.token);
    });

    // Some issue with our setup and push will not work
    this.pushNotifications.addListener('registrationError', (error: any) => {
      onError();
      console.log('REGISTRATION NOTIFICATION ERROR ' + JSON.stringify(error));
    });
  }

  // Method called when notification received
  pushNotificationReceived(callback: any): void {
    this.pushNotifications.addListener('pushNotificationReceived', (notification: PushNotification) => {
      callback(notification);
    });
  }

  // Method called when tapping on a notification
  pushNotificationActionPerformed(callback): void {
    this.pushNotifications.addListener(
      'pushNotificationActionPerformed',
      (notification: PushNotificationActionPerformed) => {
        callback(notification);
      }
    );
  }

  requestPermission(): Promise<void> {
    return new Promise<void>(async (resolve) => resolve());
  }
}
