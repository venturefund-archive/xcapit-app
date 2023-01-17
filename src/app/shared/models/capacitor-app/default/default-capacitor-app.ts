import { App, AppInfo, AppPlugin } from '@capacitor/app';
import { CapacitorApp } from '../capacitor-app.interface';

export class DefaultCapacitorApp implements CapacitorApp {
  constructor(private readonly app: AppPlugin = App) {}

  public info(): Promise<AppInfo> {
    return this.app.getInfo();
  }

  public onStateChange(callback: CallableFunction): void {
    this.app.addListener('appStateChange', (state) => {
      callback(state);
    });
  }

  public onPause(callback: CallableFunction): void {
    this.app.addListener('pause', () => {
      callback();
    });
  }
}
