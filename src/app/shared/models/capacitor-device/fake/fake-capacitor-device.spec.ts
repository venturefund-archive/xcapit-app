import { FakeCapacitorDevice } from './fake-capacitor-device';

describe('FakeCapacitorDevice', () => {
  let fakeCapacitorDevice: FakeCapacitorDevice;

  beforeEach(() => {
    fakeCapacitorDevice = new FakeCapacitorDevice(Promise.resolve({}));
  });

  it('new', () => {
    expect(fakeCapacitorDevice).toBeTruthy();
  });

  it('infoDevice', async () => {
    expect(await fakeCapacitorDevice.infoDevice()).toEqual({});
  });
});
