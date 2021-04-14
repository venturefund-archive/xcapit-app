import { TestBed } from '@angular/core/testing';
import { Storage } from '@ionic/storage';
import { LocalStorageService } from './local-storage.service';

describe('LocalStorageService', () => {
  let service: LocalStorageService;
  let storageMock: any;
  let storage: Storage;

  beforeEach(() => {
    storageMock = {
      get: () => Promise.resolve(),
      set: () => Promise.resolve(),
      remove: () => Promise.resolve(),
    };
    TestBed.configureTestingModule({
      providers: [{ provide: Storage, useValue: storageMock }],
    });
    service = TestBed.inject(LocalStorageService);
    storage = TestBed.inject(Storage);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // it('should return a true when getHideFunds is called', async () => {
  //   const spy = spyOn(storage, 'get');
  //   spy.and.returnValue(Promise.resolve('true'));
  //   const result = await service.getHideFunds();
  //   expect(result).toBe(await Promise.resolve(true));
  // });

  // it('should return a false when getHideFunds is called', async () => {
  //   const spy = spyOn(storage, 'get');
  //   spy.and.returnValue(Promise.resolve('false'));
  //   const result = await service.getHideFunds();
  //   expect(result).toBe(await Promise.resolve(false));
  // });
});
