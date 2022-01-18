import { TestBed } from '@angular/core/testing';
import { AppStorageService } from './app-storage.service';

describe('AppStorageService', () => {
  let service: AppStorageService;
  let storageSpy: any;

  beforeEach(() => {
    storageSpy = jasmine.createSpyObj('Storage', {
      set: Promise.resolve(),
      get: Promise.resolve({ value: 'test' }),
      remove: Promise.resolve(),
    });
    TestBed.configureTestingModule({
      providers: [],
    });
    service = TestBed.inject(AppStorageService);
    service.storage = storageSpy;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return a string value', async () => {
    const result = await service.get('key1');
    expect(result).toEqual('test');
  });

  it('should return a object value', async () => {
    const expectedValue = JSON.parse('{ "testKey": "testValue" }');
    storageSpy.get.and.returnValue({ value: JSON.stringify({ testKey: 'testValue' }) });
    const result = await service.get('testKey');
    expect(result).toEqual(expectedValue);
  });

  it('should set a object value', async () => {
    const result = await service.set('oneKey', { p1: 'asd', p2: 'asd' });
    expect(result);
    expect(storageSpy.set).toHaveBeenCalledTimes(1);
  });

  it('should set a string value', async () => {
    await service.set('oneKey', 'asdf');
    expect(storageSpy.set).toHaveBeenCalledTimes(1);
  });

  it('should remove a value', async () => {
    await service.remove('oneKey');
    expect(storageSpy.remove).toHaveBeenCalledTimes(1);
  });
});
