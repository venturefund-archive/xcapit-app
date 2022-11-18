import { LocalNotifications, LocalNotificationsPlugin } from '@capacitor/local-notifications';
import { LocalNotification } from '../local-notification.interface';
import { FakeLocalNotificationPlugin } from '../fake/plugin/fake-local-notification-plugin';

export class DefaultLocalNotification implements LocalNotification {
  constructor(
    private readonly _anId: number = 1,
    private readonly _aTitle: string,
    private readonly _aBody: string,
    private readonly _aPlugin: LocalNotificationsPlugin | FakeLocalNotificationPlugin = LocalNotifications
  ) {}

  private async _hasPermission() {
    return await this._aPlugin.checkPermissions().then((status) => {
      return status.display === 'granted';
    });
  }

  async send(): Promise<void> {
    if (await this._hasPermission()) {
      this._aPlugin.schedule({
        notifications: [
          {
            id: this._anId,
            title: this._aTitle,
            body: this._aBody,
          },
        ],
      });
    }
  }

  onClick(callback: CallableFunction): void {
    this._aPlugin.addListener('localNotificationActionPerformed', () => {
      callback();
    });
  }
}
