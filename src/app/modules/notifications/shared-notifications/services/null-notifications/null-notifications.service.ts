import { Injectable } from '@angular/core';
import '@firebase/messaging';
import { INotification } from '../notifications/notifications.interface';

@Injectable({
  providedIn: 'root',
})
export class NullNotificationsService implements INotification {
  constructor() {}

  init(): void {}

  requestPermission(): Promise<void> {
    return Promise.resolve();
  }

  pushNotificationReceived(callback: any): void {}

  pushNotificationActionPerformed(callback: any): void {}
}
