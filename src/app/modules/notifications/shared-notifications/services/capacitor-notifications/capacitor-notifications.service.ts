import { Injectable } from '@angular/core';
import { INotification } from '../notifications/notifications.interface';
import { Plugins, PushNotification, PushNotificationToken, PushNotificationActionPerformed } from '@capacitor/core';
import { ApiDevicesService } from '../api-devices/api-devices.service';

@Injectable({
  providedIn: 'root',
})
export class CapacitorNotificationsService implements INotification {
  token = '';
  pushNotifications = Plugins.PushNotifications;

  constructor(private apiDevicesService: ApiDevicesService) {}

  init(onError?: any): void {
    this.pushNotifications.requestPermission().then((result) => {
      if (result.granted) {
        this.pushNotifications.register();
      } else {
        console.log('Notifications permission not granted');
      }
    });

    this.pushNotifications.addListener('registration', (token: PushNotificationToken) => {
      this.token = token.value;
      this.apiDevicesService.register(this.token).subscribe();
      console.log('Push registration success, token: ' + this.token);
    });

    this.pushNotifications.addListener('registrationError', (error: any) => {
      onError();
      console.log('REGISTRATION NOTIFICATION ERROR ' + JSON.stringify(error));
    });
  }

  pushNotificationReceived(callback: any): void {
    this.pushNotifications.addListener('pushNotificationReceived', (notification: PushNotification) => {
      callback(notification);
    });
  }

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
