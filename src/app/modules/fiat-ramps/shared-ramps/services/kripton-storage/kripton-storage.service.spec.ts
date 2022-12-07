import { IonicStorageService } from 'src/app/shared/services/ionic-storage/ionic-storage.service';
import { KriptonStorageService } from './kripton-storage.service';

describe('KriptonStorageService', () => {
  let kriptonStorageService: KriptonStorageService;
  let ionicStorageSpy: jasmine.SpyObj<IonicStorageService>;

  beforeEach(() => {
    ionicStorageSpy = jasmine.createSpyObj('IonicStorageService', {
      set: Promise.resolve(),
      get: Promise.resolve('test@test.com'),
      remove: Promise.resolve()
    });
    kriptonStorageService = new KriptonStorageService(ionicStorageSpy);
  });

  it('new', () => {
    expect(kriptonStorageService).toBeTruthy();
  });

  it('set', () => {
    kriptonStorageService.set('email', 'test@test.com');
    expect(ionicStorageSpy.set).toHaveBeenCalledOnceWith('kripton_email', 'test@test.com');
  });

  it('get', async () => {
    const email = await kriptonStorageService.get('email');
    
    expect(email).toEqual('test@test.com');
    expect(ionicStorageSpy.get).toHaveBeenCalledOnceWith('kripton_email');
  });

  it('remove', () => {
    kriptonStorageService.remove('email');
    
    expect(ionicStorageSpy.remove).toHaveBeenCalledOnceWith('kripton_email');
  });
});


