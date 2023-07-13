import { Injectable } from '@angular/core';
import { CapacitorNotificationsService } from '../capacitor-notifications/capacitor-notifications.service';
import { Notification } from './notifications.interface';
import { NullNotificationsService } from '../null-notifications/null-notifications.service';
import { DefaultPlatformService } from '../../../../../shared/services/platform/default/default-platform.service';

@Injectable({
  providedIn: 'root',
})
export class NotificationsService {
  constructor(
    private capacitorNotificationsService: CapacitorNotificationsService,
    private nullNotificationsService: NullNotificationsService,
    private platformService: DefaultPlatformService
  ) {}

  getInstance(): Notification {
    return this.platformService.isNative() ? this.capacitorNotificationsService : this.nullNotificationsService;
  }
}
