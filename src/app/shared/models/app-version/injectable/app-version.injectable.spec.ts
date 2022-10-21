import { RemoteConfigService } from 'src/app/shared/services/remote-config/remote-config.service';
import { AppVersionInjectable } from './app-version.injectable';
import { DefaultAppVersion } from '../default/default-app-version';

describe('AppVersionInjectable', () => {
  let remoteConfigServiceSpy: jasmine.SpyObj<RemoteConfigService>;

  it('create', () => {
    expect(new AppVersionInjectable(remoteConfigServiceSpy).create()).toBeInstanceOf(DefaultAppVersion);
  });
});
