import { TestBed } from '@angular/core/testing';
import { IonicStorageService } from './ionic-storage.service';
import { Storage } from '@ionic/storage';

describe('IonicStorageService', () => {
  let service: IonicStorageService;
  let storageSpy: jasmine.SpyObj<Storage>;

  beforeEach(() => {
    storageSpy = jasmine.createSpyObj('Storage', {
      set: Promise.resolve(),
      get: Promise.resolve({ value: 'test' }),
      remove: Promise.resolve(),
    });
    TestBed.configureTestingModule({
      providers: [{ provide: Storage, useValue: storageSpy }],
    });
    service = TestBed.inject(IonicStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return a string value', async () => {
    const result = await service.get('test_key');
    expect(storageSpy.get).toHaveBeenCalledOnceWith('test_key');
    expect(result.value).toEqual('test');
  });

  it('should call storage set', async () => {
    await service.set('test_key', { value: 'test' });
    expect(storageSpy.set).toHaveBeenCalledOnceWith('test_key', { value: 'test' });
  });

  it('should call storage remove', async () => {
    await service.remove('test_key');
    expect(storageSpy.remove).toHaveBeenCalledWith('test_key');
  });
});
