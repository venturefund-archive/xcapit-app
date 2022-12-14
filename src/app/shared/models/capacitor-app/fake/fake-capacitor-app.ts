import { CapacitorApp } from '../capacitor-app.interface';

export class FakeCapacitorApp implements CapacitorApp {
  constructor(private readonly infoResponse: Promise<any> = Promise.resolve()) {}

  info(): Promise<any> {
    return this.infoResponse;
  }

  public onStateChange(callback: CallableFunction): void {
    return;
  }
}
