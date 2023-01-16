import { TestBed } from '@angular/core/testing';
import { of, Subscription } from 'rxjs';
import { IonicStorageService } from 'src/app/shared/services/ionic-storage/ionic-storage.service';
import { TxInProgressService } from './tx-in-progress.service';

describe('SwapInProgressService', () => {
  let service: TxInProgressService;
  let storageSpy: jasmine.SpyObj<IonicStorageService>;
  let subscription$: Subscription;

  beforeEach(() => {
    storageSpy = jasmine.createSpyObj('IonicStorageService', {
      get: Promise.resolve(),
      set: Promise.resolve(),
    });

    TestBed.configureTestingModule({
      providers: [{ provide: IonicStorageService, useValue: storageSpy }],
    });
    service = TestBed.inject(TxInProgressService);
  });

  afterEach(() => {
    subscription$.unsubscribe();
  });

  it('should be created', () => {
    subscription$ = service.inProgress().subscribe((value) => {
      expect(value).toBeFalse();
    });
    expect(service).toBeTruthy();
  });

  it('startSwap ', async () => {
    service.startSwap();
    subscription$ = service.inProgress().subscribe((value) => {
      expect(value).toBeTrue();
    });
  });

  it('finishSwap ', () => {
    service.startSwap();
    service.finishSwap();
    subscription$ = service.inProgress().subscribe((value) => {
      expect(value).toBeFalse();
    });
  });
});
