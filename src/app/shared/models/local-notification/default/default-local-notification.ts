import { LocalNotifications, LocalNotificationsPlugin } from '@capacitor/local-notifications';
import { LocalNotification } from '../local-notification.interface';
import { FakeLocalNotificationPlugin } from '../fake/plugin/fake-local-notification-plugin';

export class DefaultLocalNotification implements LocalNotification {
  constructor(
    private readonly _aTitle: string,
    private readonly _aBody: string,
    private readonly _anId: number = 1,
    private readonly _aPlugin: LocalNotificationsPlugin | FakeLocalNotificationPlugin = LocalNotifications
  ) {}

  public static create(
    aTitle: string,
    aBody: string,
    anId: number = 1,
    aPlugin: LocalNotificationsPlugin | FakeLocalNotificationPlugin = LocalNotifications
  ) {
    const notification = new this(aTitle, aBody, anId, aPlugin);
    notification.init();
    return notification;
  }

  private async _hasPermission() {
    return await this._aPlugin.checkPermissions().then((status) => {
      return status.display === 'granted';
    });
  }

  init() {
    this._aPlugin.removeAllListeners();
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
