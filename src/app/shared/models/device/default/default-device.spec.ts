import { DevicePlugin, GetLanguageCodeResult } from '@capacitor/device';
import { DefaultDevice } from './default-device';

describe('Device', () => {
  let defaultDevice: DefaultDevice;
  let deviceSpy: jasmine.SpyObj<DevicePlugin>;
  const getLanguageCode: GetLanguageCodeResult = { value: 'es' };

  beforeEach(() => {
    deviceSpy = jasmine.createSpyObj('Device', {
      getLanguageCode: Promise.resolve(getLanguageCode),
    });

    defaultDevice = new DefaultDevice(deviceSpy);
  });

  it('new', () => {
    expect(defaultDevice).toBeTruthy();
  });

  it('getLanguageCode', async () => {
    expect(await defaultDevice.getLanguageCode()).toEqual(getLanguageCode);
  });
});
