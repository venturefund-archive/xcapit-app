import { App, AppInfo, AppPlugin } from '@capacitor/app';
import { CapacitorApp } from '../capacitor-app.interface';

export class DefaultCapacitorApp implements CapacitorApp {
  constructor(private readonly app: AppPlugin = App) {}

  public info(): Promise<AppInfo> {
    return this.app.getInfo();
  }
}
