import { Injectable } from '@angular/core';
import { LocalNotifications, LocalNotificationsPlugin } from '@capacitor/local-notifications';
import { DefaultLocalNotification } from '../default/default-local-notification';
import { FakeLocalNotificationPlugin } from '../fake/plugin/fake-local-notification-plugin';

@Injectable({ providedIn: 'root' })
export class LocalNotificationInjectable {
  create(
    aTitle: string,
    aBody: string,
    anId: number = 1,
    aPlugin: LocalNotificationsPlugin | FakeLocalNotificationPlugin = LocalNotifications
  ) {
    return DefaultLocalNotification.create(aTitle, aBody, anId, aPlugin);
  }
}
