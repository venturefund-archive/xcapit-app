import { DeviceInfo, DevicePlugin } from '@capacitor/device';
import { DefaultCapacitorDevice } from './default-capacitor-device';

describe('DefaultCapacitorDevice', () => {
  let defaultCapacitorDevice: DefaultCapacitorDevice;
  let devicePluginSpy: jasmine.SpyObj<DevicePlugin>;
  const getInfoData: DeviceInfo = {
    model: 'AndroidTest',
    platform: 'android',
    manufacturer: 'Samsung',
    operatingSystem: 'android',
    osVersion: '12',
    isVirtual: true,
    webViewVersion: '12',
  };

  beforeEach(() => {
    devicePluginSpy = jasmine.createSpyObj('DevicePlugin', {
      getInfo: Promise.resolve(getInfoData),
    });

    defaultCapacitorDevice = new DefaultCapacitorDevice(devicePluginSpy);
  });

  it('new', () => {
    expect(defaultCapacitorDevice).toBeTruthy();
  });

  it('infoDevice ', async () => {
    expect(await defaultCapacitorDevice.infoDevice()).toEqual(getInfoData);
  });
});
