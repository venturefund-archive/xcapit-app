import { Device, DevicePlugin, GetLanguageCodeResult } from '@capacitor/device';
import { DeviceWrapper } from '../device-wrapper.interface';

export class DefaultDevice implements DeviceWrapper {
  constructor(private readonly _aDevicePlugin: DevicePlugin = Device) {}

  public getLanguageCode(): Promise<GetLanguageCodeResult> {
    return this._aDevicePlugin.getLanguageCode();
  }
}
