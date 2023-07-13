import { FakeRemoteConfigService } from './fake-remote-config-service';

describe('FakeRemoteConfigService', () => {
  let fakeRemoteConfigService: FakeRemoteConfigService;
  const aRemoteConfigName = 'aName';
  const aRemoteConfigValue = [{ aKey1: 'aValue1' }, { aKey2: 'aValue2' }];

  beforeEach(() => {
    fakeRemoteConfigService = new FakeRemoteConfigService(aRemoteConfigValue);
  });

  it('new', () => {
    expect(fakeRemoteConfigService).toBeTruthy();
  });

  it('getObject', () => {
    expect(fakeRemoteConfigService.getObject(aRemoteConfigName)).toEqual(aRemoteConfigValue);
  });

  it('getString', () => {
    expect(fakeRemoteConfigService.getString(aRemoteConfigName)).toEqual('');
  });

  it('getFeatureFlag', () => {
    expect(fakeRemoteConfigService.getFeatureFlag(aRemoteConfigName)).toBeFalse();
  });
});
