import { CapacitorDevice } from '../capacitor-device.interface';

export class FakeCapacitorDevice implements CapacitorDevice {
  constructor(private readonly infoResponse: Promise<any> = Promise.resolve()) {}

  public infoDevice(): Promise<any> {
    return this.infoResponse;
  }
}
