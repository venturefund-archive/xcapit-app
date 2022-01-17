import { Injectable } from '@angular/core';
import { Notification } from '../notifications/notifications.interface';

@Injectable({
  providedIn: 'root',
})
export class NullNotificationsService implements Notification {
  constructor() {}

  init(): void {}

  requestPermission(): Promise<void> {
    return Promise.resolve();
  }

  pushNotificationReceived(): void {}

  pushNotificationActionPerformed(): void {}
}
