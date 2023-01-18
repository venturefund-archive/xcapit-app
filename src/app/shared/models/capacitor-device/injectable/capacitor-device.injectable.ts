import { Injectable } from '@angular/core';
import { Device, DevicePlugin } from '@capacitor/device';
import { CapacitorDevice } from '../capacitor-device.interface';
import { DefaultCapacitorDevice } from '../default/default-capacitor-device';

@Injectable({ providedIn: 'root' })
export class CapacitorDeviceInjectable {
  constructor() {}

  create(device: DevicePlugin = Device): CapacitorDevice {
    return new DefaultCapacitorDevice(device);
  }
}
