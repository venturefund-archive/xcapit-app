import { LocalNotification } from '../local-notification.interface';

export class FakeLocalNotification implements LocalNotification {
  private callback: any;

  send(): Promise<void> {
    return Promise.resolve();
  }

  onClick(callback: any): void {
    this.callback = callback;
  }

  triggerOnClick(): void {
    this.callback();
  }
}
