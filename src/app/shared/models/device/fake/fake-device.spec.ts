import { FakeDevice } from "./fake-device";

describe('FakeDevice', () => {
  let fakeDevice: FakeDevice;

  beforeEach(() => {
    fakeDevice = new FakeDevice(Promise.resolve({}));
  });

  it('new', () => {
    expect(fakeDevice).toBeTruthy();
  });

  it('getLanguageCode', async () => {
    expect(await fakeDevice.getLanguageCode()).toEqual({});
  });
});
