import { Injectable } from '@angular/core';
import { DefaultDevice } from '../default/default-device';
import { DeviceWrapper } from '../device.interface';

@Injectable({ providedIn: 'root' })
export class DeviceInjectable {
  constructor() {}
  public create(): DeviceWrapper {
    return new DefaultDevice();
  }
}
