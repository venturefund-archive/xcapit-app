import { DevicePlugin, GetLanguageCodeResult } from '@capacitor/device';
import { FakeDevice } from '../fake/fake-device';
import { Device } from '@capacitor/device';
import { DeviceWrapper } from '../device.interface';

export class DefaultDevice implements DeviceWrapper {
  constructor(private readonly _aDevicePlugin: DevicePlugin | FakeDevice = Device) {}

  public getLanguageCode(): Promise<GetLanguageCodeResult> {
    return this._aDevicePlugin.getLanguageCode();
  }
}
