import { Injectable } from '@angular/core';
import { Action, ActionType, LocalNotificationActionPerformed, LocalNotifications, LocalNotificationSchema } from '@capacitor/local-notifications';

@Injectable({
  providedIn: 'root',
})
export class LocalNotificationsService {
  localNotifications = LocalNotifications;
  private hasPermission = false;

  constructor() {}

  init(): void {
    this.localNotifications.requestPermissions().then((result) => {
      this.hasPermission = result.display == 'granted';
    });
  }

  async send(notifications: LocalNotificationSchema[]) {
    if (this.hasPermission) await this.localNotifications.schedule({ notifications });
  }

  setActionTypes(id: string, actions: Action[]) {
    this.localNotifications.registerActionTypes({ types: [{ id, actions }] });
  }

  addListener(callback: CallableFunction) {
    this.localNotifications.addListener('localNotificationActionPerformed',()=>{
      console.log('action performance')
      callback()
    })
  }
}
