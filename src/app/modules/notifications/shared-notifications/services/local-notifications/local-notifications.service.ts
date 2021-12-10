import { Injectable } from '@angular/core';
import { LocalNotifications, LocalNotificationSchema } from '@capacitor/local-notifications';

@Injectable({
  providedIn: 'root',
})
export class LocalNotificationsService {
  private readonly localNotifications = LocalNotifications;

  constructor() {}

  init(): void {
    this.localNotifications.requestPermissions().then((result) => {
      if (result.display == 'granted') {
        this.addListeners();
      } else {
        console.log('Notifications permission not granted');
      }
    });
  }

  addListeners() {
    this.localNotifications.addListener('localNotificationReceived', (notification: LocalNotificationSchema) =>
      this.localNotificationReceived(notification)
    );
  }

  private localNotificationReceived(notification: LocalNotificationSchema) {
    console.log('NOTIFICATION RECEIVED', notification);
  }

  async send(notifications: LocalNotificationSchema[]) {
    await this.localNotifications.schedule({ notifications });
  }
}
