import { Injectable } from '@angular/core';
import { INotification } from '../notifications.interface';
import { firebase } from '@firebase/app';
import { environment } from 'src/environments/environment';
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
  messaging: any;
  constructor() {}

  init(): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      navigator.serviceWorker.ready.then(
        registration => {
          // Don't crash an error if messaging not supported
          if (!firebase.messaging.isSupported()) {
            resolve();
            return;
          }

          this.messaging = firebase.messaging();

          // Register the Service Worker
          this.messaging.useServiceWorker(registration);

          // Initialize your VAPI key
          this.messaging.usePublicVapidKey(environment.firebase.vapidKey);
          resolve();

          // Optional and not covered in the article
          // TODO: Handle token refresh
          // this.messaging.onTokenRefresh(() => {
          //   this.messaging
          //     .getToken()
          //     .then((refreshedToken: string) => {
          //       console.log(refreshedToken);
          //     })
          //     .catch(err => {
          //       console.error(err);
          //     });
          // });
        },
        err => {
          reject(err);
        }
      );
    });
  }

  requestPermission(): Promise<void> {
    return new Promise<void>(async resolve => {
      if (!Notification) {
        resolve();
        return;
      }
      if (!firebase.messaging.isSupported()) {
        resolve();
        return;
      }
      try {
        const messaging = firebase.messaging();
        await Notification.requestPermission();

        const token: string = await messaging.getToken();

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
