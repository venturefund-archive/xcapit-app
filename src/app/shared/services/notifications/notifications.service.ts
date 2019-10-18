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
    return this.platform.is('capacitor')
      ? this.capacitorNotificationsService
      : this.pwaNotificationsService;
  }
}
