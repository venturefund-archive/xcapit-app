import { Device, DeviceInfo, DevicePlugin } from '@capacitor/device';
import { CapacitorDevice } from '../capacitor-device.interface';

export class DefaultCapacitorDevice implements CapacitorDevice {
  constructor(private readonly device: DevicePlugin = Device) {}

  public infoDevice(): Promise<DeviceInfo> {
    return this.device.getInfo();
  }
}
