import { fakeAsync, TestBed, tick } from '@angular/core/testing';
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
      getFeatureFlag: () => true,
      getString: () => 'test',
      getObject: () => [{ test: 'test' }],
    };
    TestBed.configureTestingModule({});
    service = TestBed.inject(RemoteConfigService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call initialize on initialize', fakeAsync(() => {
    const spy = spyOn(remoteConfigMock, 'initialize');
    service.initialize(remoteConfigMock);
    tick();
    expect(spy).toHaveBeenCalledTimes(1);
  }));

  it('should call getFeatureFlag on getFeatureFlag', async () => {
    const spy = spyOn(remoteConfigMock, 'getFeatureFlag');
    await service.initialize(remoteConfigMock);
    service.getFeatureFlag('test');
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call getString on getString', async () => {
    const spy = spyOn(remoteConfigMock, 'getString');
    await service.initialize(remoteConfigMock);
    service.getString('test');
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call getObject on getObject', async () => {
    const spy = spyOn(remoteConfigMock, 'getObject');
    await service.initialize(remoteConfigMock);
    service.getObject('test');
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
