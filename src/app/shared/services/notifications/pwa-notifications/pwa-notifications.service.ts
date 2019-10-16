import { Injectable } from '@angular/core';
import { INotification } from '../notifications.interface';
import { firebase } from '@firebase/app';
import { environment } from 'src/environments/environment';
import { FirebaseMessaging } from '@firebase/messaging-types';

export interface INotificationObject {
  title: string;
  message: string;
  image: any;
}
@Injectable({
  providedIn: 'root'
})
export class PwaNotificationsService implements INotification {
  messaging: FirebaseMessaging;
  token: string;
  constructor() {}

  init(): void {
    const firebaseApp = firebase.initializeApp(environment.firebase);
    this.messaging = firebaseApp.messaging();
    this.messaging.usePublicVapidKey(environment.firebase.vapidKey);
  }

  requestPermission(): Promise<void> {
    return new Promise<void>(async resolve => {
      if (!Notification || !firebase.messaging.isSupported()) {
        resolve();
        return;
      }
      try {
        await Notification.requestPermission();
        this.token = await this.messaging.getToken();
      } catch (err) {
        // No notifications granted
      }
      resolve();
    });
  }

  pushNotificationReceived(callback: any): void {
    navigator.serviceWorker.addEventListener('message', message => {
      console.log({ message });
      callback(message);
    });
  }

  // Method called when tapping on a notification
  pushNotificationActionPerformed(callback: any): void {
    // TODO
  }
}
