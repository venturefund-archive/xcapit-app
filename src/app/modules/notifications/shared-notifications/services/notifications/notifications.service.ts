import { Injectable } from '@angular/core';
import { CapacitorNotificationsService } from '../capacitor-notifications/capacitor-notifications.service';
import { INotification } from './notifications.interface';
import { PwaNotificationsService } from '../pwa-notifications/pwa-notifications.service';
import { Capacitor } from '@capacitor/core';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  constructor(
    private capacitorNotificationsService: CapacitorNotificationsService,
    private pwaNotificationsService: PwaNotificationsService
  ) {}

  getInstance(): INotification {
    return Capacitor.platform !== 'web'
      ? this.capacitorNotificationsService
      : this.pwaNotificationsService;
  }
}
