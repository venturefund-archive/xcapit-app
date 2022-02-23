import { IonicStorageService } from './../ionic-storage/ionic-storage.service';
import { TestBed } from '@angular/core/testing';
import { CacheService } from './cache.service';

describe('CacheService', () => {
  let service: CacheService;
  let storageSpy: jasmine.SpyObj<IonicStorageService>;

  beforeEach(() => {
    storageSpy = jasmine.createSpyObj('IonicStorageService', {
      set: Promise.resolve(),
      get: Promise.resolve({ balance: 1.23456, expiration_date: 1234 }),
      remove: Promise.resolve(),
    });

    TestBed.configureTestingModule({
      providers: [{ provide: IonicStorageService, useValue: storageSpy }],
    });
    service = TestBed.inject(CacheService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call storage service set on update', async () => {
    await service.update('ERC20_ETH', { balance: 1.23456789 });
    expect(storageSpy.set).toHaveBeenCalledTimes(1);
  });

  it('should call storage service remove when date is expired on get', async () => {
    const getResponse = await service.get('test_key');
    expect(storageSpy.remove).toHaveBeenCalledOnceWith('_cache_test_key');
    expect(getResponse).toEqual(undefined);
  });

  it('should not call storage service remove and should return the cached value', async () => {
    storageSpy.get.and.resolveTo({ balance: 1.23456, expiration_date: 99999999999999999 });
    const getResponse = await service.get('test_key');
    expect(storageSpy.remove).not.toHaveBeenCalled();
    expect(getResponse).toEqual({ balance: 1.23456, expiration_date: 99999999999999999 });
  });

  it('should call storage service remove on remove', async () => {
    await service.remove('ERC20_ETH');
    expect(storageSpy.remove).toHaveBeenCalledOnceWith('_cache_ERC20_ETH');
  });
});
