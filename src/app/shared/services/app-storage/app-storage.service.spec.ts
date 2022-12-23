import { TestBed } from '@angular/core/testing';
import { AppStorageService, FakeAppStorage, StorageService } from './app-storage.service';

describe('AppStorageService', () => {
  let service: AppStorageService;
  let storageSpy: any;
  let windowStorageSpy: any;

  beforeEach(() => {
    storageSpy = jasmine.createSpyObj('Storage', {
      set: Promise.resolve(),
      get: Promise.resolve({ value: 'test' }),
      remove: Promise.resolve(),
    });

    windowStorageSpy = jasmine.createSpyObj('window.localStorage', {
      removeItem: (): void => {},
    });

    TestBed.configureTestingModule({
      providers: [],
    });
    service = TestBed.inject(AppStorageService);
    service.storage = storageSpy;
    service.windowStorage = windowStorageSpy;
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

  it('should force remove a value from storage', async () => {
    await service.forceRemove('oneKey');
    expect(windowStorageSpy.removeItem).toHaveBeenCalledTimes(1);
  });
});

describe('FakeAppStorage ', () => {
  const aKey = 'key';
  const aTestValue = 1;
  let storage: StorageService;

  beforeEach(() => {
    storage = new FakeAppStorage({ [aKey]: aTestValue });
  });

  it('new', () => {
    expect(new FakeAppStorage()).toBeTruthy();
  });

  it('get value', async () => {
    expect(await storage.get(aKey)).toEqual(aTestValue);
  });

  it('set value', async () => {
    const anotherKey = 'anotherKey';
    const anotherTestValue = 2;

    await storage.set(anotherKey, anotherTestValue);

    expect(await storage.get(aKey)).toEqual(aTestValue);
    expect(await storage.get(anotherKey)).toEqual(anotherTestValue);
  });

  it('should copy values and not modify original', async () => {
    const original = { myValue: 'value' };
    const storage = new FakeAppStorage(original);
    await storage.set('myValue', 'newValue');
    expect(await storage.get('myValue')).toEqual('newValue');
    expect(original.myValue).toEqual('value');
  })
});
