import { DeviceInfo } from '@capacitor/device';

export interface CapacitorDevice {
  infoDevice(): Promise<DeviceInfo>;
}
