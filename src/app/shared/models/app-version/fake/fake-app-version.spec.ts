import { FakeAppVersion } from './fake-app-version';
describe('FakeAppVersion', () => {
  let fakeAppVersion: FakeAppVersion;

  beforeEach(() => {
    fakeAppVersion = new FakeAppVersion(Promise.resolve('3.0.0'), '3.0.1', Promise.resolve(false));
  });

  it('new', () => {
    expect(fakeAppVersion).toBeTruthy();
  });

  it('current', async () => {
    expect(await fakeAppVersion.current()).toEqual('3.0.0');
  });

  it('lastAvailable', async () => {
    expect(await fakeAppVersion.lastAvailable()).toEqual('3.0.1');
  });

  it('updated', async () => {
    expect(await fakeAppVersion.updated()).toEqual(false);
  });
});
