import { Injectable } from '@angular/core';
import { Notification } from '../notifications/notifications.interface';
import {
  ActionPerformed,
  PushNotifications,
  PushNotificationSchema,
  PushNotificationsPlugin,
  RegistrationError,
  Token,
} from '@capacitor/push-notifications';
import { FCM } from '@capacitor-community/fcm';
import { ApiDevicesService } from '../api-devices/api-devices.service';
import { DefaultPlatformService } from 'src/app/shared/services/platform/default/default-platform.service';
import { FakePushNotifications } from '../../models/fake-push-notifications/fake-push-notifications';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class CapacitorNotificationsService implements Notification {
  token = '';
  pushNotifications: PushNotificationsPlugin | FakePushNotifications = PushNotifications;
  firebaseCloudMessaging = FCM;

  private _registered = false;

  constructor(private apiDevicesService: ApiDevicesService, private platformService: DefaultPlatformService) {}

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

  private addRegistrationListener() {
    this.pushNotifications.addListener('registration', async (token: Token) => {
      this.token = token.value;
      if (!this._registered) {
        await this.apiDevicesService.register(this.token).toPromise();
        this._registered = true;
      }
    });
  }

  private addErrorListener() {
    this.pushNotifications.addListener('registrationError', (error: RegistrationError) => {
      console.error('REGISTRATION NOTIFICATION ERROR ' + JSON.stringify(error));
    });
  }

  init() {
    if (this.platformService.isNative()) {
      try {
        this.addRegistrationListener();
        this.addErrorListener();
      } catch (e) {
        console.error('Add push notifications listeners error', e);
      }
    }
  }

  register() {
    return this.pushNotifications.register();
  }

  clearRegistration() {
    this._registered = false;
  }

  toggleUserNotifications(value: boolean): Observable<any> {
    return this.apiDevicesService.togglePushNotifications(value);
  }
}
