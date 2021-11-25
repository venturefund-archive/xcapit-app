import { Injectable } from '@angular/core';
import { INotification } from '../notifications/notifications.interface';
import { ApiDevicesService } from '../api-devices/api-devices.service';
import { PlatformService } from '../../../../../shared/services/platform/platform.service';
import { ActionPerformed, PushNotifications, PushNotificationSchema, Token } from '@capacitor/push-notifications';

@Injectable({
  providedIn: 'root',
})
export class CapacitorNotificationsService implements INotification {
  token = '';
  pushNotifications = PushNotifications;

  constructor(private apiDevicesService: ApiDevicesService, private platformService: PlatformService) {
    if (this.platformService.isNative()) this.addListeners();
  }

  init(): void {
    this.pushNotifications.requestPermissions().then((result) => {
      if (result.receive === 'granted') {
        this.pushNotifications.register();
      } else {
        console.log('Notifications permission not granted');
      }
    });
  }

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

  requestPermission(): Promise<void> {
    return new Promise<void>(async (resolve) => resolve());
  }

  private addErrorListener() {
    this.pushNotifications.addListener('registrationError', (error: any) => {
      console.log('REGISTRATION NOTIFICATION ERROR ' + JSON.stringify(error));
    });
  }

  private addRegistrationListener() {
    this.pushNotifications.addListener('registration', (token: Token) => {
      this.token = token.value;
      this.apiDevicesService.register(this.token).subscribe();
      console.log('Push registration success, token: ' + this.token);
    });
  }

  addListeners() {
    try {
      this.addRegistrationListener();
      this.addErrorListener();
    } catch (e) {
      console.log('Add push notifications listeners error', e);
    }
  }
}
