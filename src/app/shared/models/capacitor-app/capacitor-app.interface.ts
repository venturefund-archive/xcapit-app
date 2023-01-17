import { AppInfo } from '@capacitor/app';

export interface CapacitorApp {
  info(): Promise<AppInfo>;
  onStateChange(callback: CallableFunction): void;
  onPause(callback: CallableFunction): void;
}
