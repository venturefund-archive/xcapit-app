import { TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { XAuthService } from './x-auth.service';
import { IonicStorageService } from 'src/app/shared/services/ionic-storage/ionic-storage.service';

describe('XAuthService', () => {
  let service: XAuthService;
  let ionicStorageServiceSpy: jasmine.SpyObj<IonicStorageService>;
  const token = 'aToken';
  beforeEach(waitForAsync(() => {
    ionicStorageServiceSpy = jasmine.createSpyObj('IonicStorageService', {
      get: Promise.resolve(token),
      set: Promise.resolve(),
    });
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([])],
      providers: [{ provide: IonicStorageService, useValue: ionicStorageServiceSpy }],
    });
  }));

  beforeEach(() => {
    service = TestBed.inject(XAuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get token', async () => {
    expect(await service.token()).toEqual(token);
  });

  it('should save token', async () => {
    await service.saveToken(token);

    expect(ionicStorageServiceSpy.set).toHaveBeenCalledOnceWith(service.header(), token);
  });
});
