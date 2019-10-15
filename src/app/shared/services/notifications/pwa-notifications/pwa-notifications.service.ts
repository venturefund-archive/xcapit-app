import { Injectable } from '@angular/core';
import { INotification } from '../notifications.interface';
import { firebase } from '@firebase/app';
import { environment } from 'src/environments/environment';
import { FirebaseMessaging } from '@firebase/messaging-types';
import { PushNotification } from '@capacitor/core';

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
  constructor() {}

  init(): void {
    console.log('INIT PUSH in PWA');
    // navigator.serviceWorker.ready.then(
    //   registration => {
    //     // Don't crash an error if messaging not supported
    //     if (!firebase.messaging.isSupported()) {
    //       return;
    //     }

    //     this.messaging = firebase.messaging();

    //     // Register the Service Worker
    //     this.messaging.useServiceWorker(registration);

    //     // Initialize your VAPI key
    //     this.messaging.usePublicVapidKey(environment.firebase.vapidKey);
    //   },
    //   err => console.log(err)
    // );

    this.messaging = firebase.messaging();
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
        const token: string = await this.messaging.getToken();
        console.log('User notifications token:', token);
      } catch (err) {
        // No notifications granted
      }

      resolve();
    });
  }

  // Listen to messages when your app is in the foreground
  pushNotificationReceived(callback): void {
    this.messaging.onMessage((payload: any) => {
      callback(payload as PushNotification);
    });
  }

  // Method called when tapping on a notification
  pushNotificationActionPerformed(callback): void {
    // TODO: implementar
  }
}
