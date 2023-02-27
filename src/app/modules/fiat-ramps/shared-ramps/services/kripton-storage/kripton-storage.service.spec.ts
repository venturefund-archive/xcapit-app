import { TestBed } from '@angular/core/testing';
import { IonicStorageService } from 'src/app/shared/services/ionic-storage/ionic-storage.service';
import { KriptonStorageService } from './kripton-storage.service';

describe('KriptonStorageService', () => {
  let service: KriptonStorageService;
  let ionicStorageSpy: jasmine.SpyObj<IonicStorageService>;

  beforeEach(() => {
    ionicStorageSpy = jasmine.createSpyObj('IonicStorageService', {
      set: Promise.resolve(),
      get: Promise.resolve('test@test.com'),
      remove: Promise.resolve()
    });
    TestBed.configureTestingModule({
      providers: [
        { provide: IonicStorageService, useValue: ionicStorageSpy },
      ],
    });
    service = TestBed.inject(KriptonStorageService);
  });

  it('new', () => {
    expect(service).toBeTruthy();
  });

  it('set', async () => {
    await service.set('email', 'test@test.com');
    expect(ionicStorageSpy.set).toHaveBeenCalledOnceWith('kripton_email', 'test@test.com');
  });

  it('get', async () => {
    const email = await service.get('email');
    
    expect(email).toEqual('test@test.com');
    expect(ionicStorageSpy.get).toHaveBeenCalledOnceWith('kripton_email');
  });

  it('remove', async () => {
    await service.remove('email');
    
    expect(ionicStorageSpy.remove).toHaveBeenCalledOnceWith('kripton_email');
  });

  it('removeCredentials', async () => {
    await service.removeCredentials();
    
    expect(ionicStorageSpy.remove).toHaveBeenCalledWith('kripton_email');
    expect(ionicStorageSpy.remove).toHaveBeenCalledWith('kripton_access_token');
    expect(ionicStorageSpy.remove).toHaveBeenCalledWith('kripton_refresh_token');
    expect(ionicStorageSpy.remove).toHaveBeenCalledWith('kripton_user_status');
  });
});


