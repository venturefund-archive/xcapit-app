import { TestBed } from '@angular/core/testing';
import { IonicStorageService } from 'src/app/shared/services/ionic-storage/ionic-storage.service';
import { AppExpirationTimeService } from './app-expiration-time.service';

describe('AppExpirationTimeService', () => {
  let service: AppExpirationTimeService;
  let ionicStorageServiceSpy: jasmine.SpyObj<IonicStorageService>;

  beforeEach(() => {
    ionicStorageServiceSpy = jasmine.createSpyObj('IonicStorageService', {
      get: Promise.resolve(5),
      set: Promise.resolve(),
    });

    TestBed.configureTestingModule({
      providers: [{ provide: IonicStorageService, useValue: ionicStorageServiceSpy }],
    });
    service = TestBed.inject(AppExpirationTimeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('get', async () => {
    const result = await service.get();

    expect(ionicStorageServiceSpy.get).toHaveBeenCalledTimes(1);
    expect(result).toEqual(5);
  });

  it('set', async () => {
    service.set(4);

    expect(ionicStorageServiceSpy.set).toHaveBeenCalledOnceWith('_xcp_app_session_expiration_time', 4);
  });

  it('should set default expiration time value to 2 when no storage value is found', async () => {
    ionicStorageServiceSpy.get.and.returnValue(Promise.resolve(null));
    const result = await service.get();

    expect(ionicStorageServiceSpy.get).toHaveBeenCalledTimes(1);
    expect(result).toEqual(2);
  });
});
