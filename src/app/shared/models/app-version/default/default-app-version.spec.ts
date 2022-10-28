import { RemoteConfigService } from 'src/app/shared/services/remote-config/remote-config.service';
import { CapacitorApp } from '../../capacitor-app/capacitor-app.interface';
import { FakeCapacitorApp } from '../../capacitor-app/fake/fake-capacitor-app';
import { DefaultAppVersion } from './default-app-version';

describe('DefaultAppVersion', () => {
  let appVersion: DefaultAppVersion;
  let fakeCapacitorApp: CapacitorApp;
  let remoteconfigServiceSpy: jasmine.SpyObj<RemoteConfigService>;

  beforeEach(() => {
    fakeCapacitorApp = new FakeCapacitorApp(Promise.resolve({ version: '3.0.0' }));
    remoteconfigServiceSpy = jasmine.createSpyObj('RemoteConfigService', {
      getString: '3.0.1',
    });
    appVersion = new DefaultAppVersion(fakeCapacitorApp, remoteconfigServiceSpy);
  });

  it('new', () => {
    expect(appVersion).toBeTruthy();
  });

  it('current', async () => {
    expect(await appVersion.current()).toEqual('3.0.0');
  });

  it('lastAvailable', async () => {
    expect(await appVersion.lastAvailable()).toEqual('3.0.1');
  });

  it('updated', async () => {
    expect(await appVersion.updated()).toEqual(false);
  });
});
