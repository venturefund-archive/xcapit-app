import { Injectable } from '@angular/core';
import { LocalNotification, Plugins } from '@capacitor/core';

@Injectable({
  providedIn: 'root',
})
export class LocalNotificationsService {
  private readonly localNotifications = Plugins.LocalNotifications;

  constructor() {}

  init(): void {
    this.localNotifications.requestPermission().then((result) => {
      if (result.granted) {
        this.addListeners();
      } else {
        console.log('Notifications permission not granted');
      }
    });
  }

  addListeners() {
    this.localNotifications.addListener('localNotificationReceived', (notification: LocalNotification) =>
      this.localNotificationReceived(notification)
    );
  }

  private localNotificationReceived(notification: LocalNotification) {
    console.log('NOTIFICATION RECEIVED', notification);
  }

  async send(notifications: LocalNotification[]) {
    await this.localNotifications.schedule({ notifications });
  }
}
