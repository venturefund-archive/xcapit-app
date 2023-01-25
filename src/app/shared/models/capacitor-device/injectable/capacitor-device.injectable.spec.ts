import { DefaultCapacitorDevice } from '../default/default-capacitor-device';
import { CapacitorDeviceInjectable } from './capacitor-device.injectable';

describe('CapacitorDeviceInjectable', () => {
  it('Create', () => {
    expect(new CapacitorDeviceInjectable().create()).toBeInstanceOf(DefaultCapacitorDevice);
  });
});
