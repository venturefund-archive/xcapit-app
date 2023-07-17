import { Injectable } from '@angular/core';
import { Action, LocalNotifications, LocalNotificationSchema } from '@capacitor/local-notifications';
import { DefaultPlatformService } from 'src/app/shared/services/platform/default/default-platform.service';

@Injectable({
  providedIn: 'root',
})
export class LocalNotificationsService {
  localNotifications = LocalNotifications;
  private hasPermission = false;

  constructor(private platformService: DefaultPlatformService) {}

  async init(): Promise<any> {
    return this.localNotifications.requestPermissions().then((result) => {
      this.hasPermission = result.display == 'granted';
    });
  }

  async send(notifications: LocalNotificationSchema[]) {
    if (this.hasPermission) await this.localNotifications.schedule({ notifications });
  }

  registerActionTypes(id: string, actions: Action[]) {
    if (this.platformService.isNative()) {
      this.localNotifications.registerActionTypes({ types: [{ id, actions }] });
    }
  }

  addListener(callback: CallableFunction) {
    this.localNotifications.addListener('localNotificationActionPerformed', () => {
      callback();
    });
  }
}
