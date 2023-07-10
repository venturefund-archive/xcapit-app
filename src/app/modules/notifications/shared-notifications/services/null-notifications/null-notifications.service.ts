import { Injectable } from '@angular/core';
import { Notification } from '../notifications/notifications.interface';

@Injectable({
  providedIn: 'root',
})
export class NullNotificationsService implements Notification {
  constructor() {}

  init(): void {}

  register(): void {}

  clearRegistration(): void {}

  requestPermission(): Promise<void> {
    return Promise.resolve();
  }

  pushNotificationReceived(): void {}

  pushNotificationActionPerformed(): void {}

  subscribeTo(aTopic: string): void {}

  unsubscribeFrom(aTopic: string): void {}

  toggleUserNotifications (active: boolean): void {}
}
