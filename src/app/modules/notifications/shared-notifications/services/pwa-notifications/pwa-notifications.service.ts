import { Injectable } from '@angular/core';
import '@firebase/messaging';
import { firebase } from '@firebase/app';
import { environment } from 'src/environments/environment';
import { FirebaseMessaging } from '@firebase/messaging-types';
import { FirebaseNamespace } from '@firebase/app-types';
import { INotification } from '../notifications/notifications.interface';

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
  importedFirebase: FirebaseNamespace = firebase;
  constructor() {}

  init(): void {
    const firebaseApp = this.importedFirebase.initializeApp(environment.firebase);
    this.messaging = firebaseApp.messaging();
    this.messaging.usePublicVapidKey(environment.firebase.vapidKey);
  }

  requestPermission(): Promise<void> {
    return new Promise<void>(async resolve => {
      if (!this.importedFirebase.messaging.isSupported() || !Notification) {
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
      callback(message);
    });
    this.messaging.onMessage(message => {
      callback(message);
    });
  }

  // Method called when tapping on a notification
  pushNotificationActionPerformed(callback: any): void {
    // TODO
  }
}
