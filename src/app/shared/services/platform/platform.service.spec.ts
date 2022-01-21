import { TestBed } from '@angular/core/testing';
import { PlatformService } from './platform.service';

describe('PlatformService', () => {
  let service: PlatformService;
  let capacitorSpy: jasmine.SpyObj<any>;

  beforeEach(() => {
    capacitorSpy = jasmine.createSpyObj('Capacitor', {
      getPlatform: 'web',
      isNativePlatform: false
    });

    TestBed.configureTestingModule({
      providers: [],
    });
    service = TestBed.inject(PlatformService);
    service.capacitor = capacitorSpy;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should isWeb return true on web platform', () => {
    expect(service.isWeb()).toBeTrue();
  });

  it('should isWeb return false on android platform', () => {
    capacitorSpy.getPlatform.and.returnValue('android');
    expect(service.isWeb()).toBeFalse();
  });

  it('should isNative return true on native platform', () => {
    capacitorSpy.isNativePlatform.and.returnValue(true);
    expect(service.isNative()).toBeTrue();
  });

  it('should isNative return false on no native platform', () => {
    capacitorSpy.isNativePlatform.and.returnValue(false);
    expect(service.isNative()).toBeFalse();
  });

  it('should platform return web', () => {
    expect(service.platform()).toEqual('web');
  });
});
