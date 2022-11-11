import { AppInfo } from '@capacitor/app';
import { CapacitorApp } from '../capacitor-app.interface';

export class FakeCapacitorApp implements CapacitorApp {
  constructor(private readonly infoResponse: Promise<any> = Promise.resolve()) {}

  info(): Promise<any> {
    return this.infoResponse;
  }
}
