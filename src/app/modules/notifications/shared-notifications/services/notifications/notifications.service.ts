import { Injectable } from '@angular/core';
import { CapacitorNotificationsService } from '../capacitor-notifications/capacitor-notifications.service';
import { INotification } from './notifications.interface';
import { Platform } from '@ionic/angular';
import { PwaNotificationsService } from '../pwa-notifications/pwa-notifications.service';

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
