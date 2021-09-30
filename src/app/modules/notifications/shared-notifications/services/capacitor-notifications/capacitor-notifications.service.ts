import { Injectable } from '@angular/core';
import { INotification } from '../notifications/notifications.interface';
import { Plugins, PushNotification, PushNotificationToken, PushNotificationActionPerformed } from '@capacitor/core';
import { ApiDevicesService } from '../api-devices/api-devices.service';
import { PlatformService } from '../../../../../shared/services/platform/platform.service';

@Injectable({
  providedIn: 'root',
})
export class CapacitorNotificationsService implements INotification {
  token = '';
  pushNotifications = Plugins.PushNotifications;

  constructor(private apiDevicesService: ApiDevicesService) {}

  init(): void {
    this.pushNotifications.requestPermission().then((result) => {
      if (result.granted) {
        this.addListeners();
        this.pushNotifications.register();
      } else {
        console.log('Notifications permission not granted');
      }
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

  private addErrorListener() {
    this.pushNotifications.addListener('registrationError', (error: any) => {
      console.log('REGISTRATION NOTIFICATION ERROR ' + JSON.stringify(error));
    });
  }

  private addRegistrationListener() {
    this.pushNotifications.addListener('registration', (token: PushNotificationToken) => {
      this.token = token.value;
      this.apiDevicesService.register(this.token).subscribe();
      console.log('Push registration success, token: ' + this.token);
    });
  }

  private addListeners() {
    try {
      this.addRegistrationListener();
      this.addErrorListener();
    } catch (e) {
      console.log('Add push notifications listeners error', e);
    }
  }
}
