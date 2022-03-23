import { TestBed } from '@angular/core/testing';
import { RemoteConfiguration } from '../../interfaces/remote-configuration.interface';
import { RemoteConfigService } from './remote-config.service';

describe('RemoteConfigService', () => {
  let service: RemoteConfigService;
  let remoteConfigMock: RemoteConfiguration;

  beforeEach(() => {
    remoteConfigMock = {
      defaultConfig: {},
      initialize: () => Promise.resolve(),
      setDefaultConfig: () => {},
      getFeatureFlag: () => true
    };
    TestBed.configureTestingModule({});
    service = TestBed.inject(RemoteConfigService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call initialize on initialize', async () => {
    const spy = spyOn(remoteConfigMock, 'initialize');
    await service.initialize(remoteConfigMock);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call getFeatureFlag on getFeatureFlag', async () => {
    const spy = spyOn(remoteConfigMock, 'getFeatureFlag');
    await service.initialize(remoteConfigMock);
    service.getFeatureFlag('test');
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
