import { Injectable } from '@angular/core';
import { firebase } from '@firebase/app';
import '@firebase/messaging';
import { environment } from 'src/environments/environment';
import { CapacitorNotificationsService } from './capacitor-notifications/capacitor-notifications.service';
import { PwaNotificationsService } from './pwa-notifications/pwa-notifications.service';
import { INotification } from './notifications.interface';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  constructor(
    private capacitorNotificationsService: CapacitorNotificationsService,
    private pwaNotificationsService: PwaNotificationsService,
    private platform: Platform
  ) {}

  getInstance(): INotification {
    if (this.platform.is('capacitor')) {
      console.log('SOY CAPACITOR PLATFORMMMMM');
      return this.capacitorNotificationsService;
    } else if (this.platform.is('pwa')) {
      console.log('SOY PWA PLATFORMMMMM');
      return this.pwaNotificationsService;
    } else {
      console.log('NO ES PWA NI CAPACITOR PLATFORMMMMM');
      return {
        init: () => console.log('error notifications init no platform'),
        requestPermission: () => new Promise(resolve => resolve()),
        pushNotificationReceived: () =>
          console.log('error notifications received no platform'),
        pushNotificationActionPerformed: () =>
          console.log('error notifications received no platform')
      };
    }
  }
}
