import { TestBed } from '@angular/core/testing';
import { Subscription } from 'rxjs';
import { TxInProgress } from 'src/app/modules/users/shared-users/models/tx-in-progress/tx-in-progress';
import { IonicStorageService } from 'src/app/shared/services/ionic-storage/ionic-storage.service';
import { TxInProgressService } from './tx-in-progress.service';

describe('TxInProgressService', () => {
  let service: TxInProgressService;
  let storageSpy: jasmine.SpyObj<IonicStorageService>;
  let subscription$: Subscription;
  const txSend = new TxInProgress('send');
  const txSwap = new TxInProgress('swap');

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
      expect(value).toEqual([]);
    });
    expect(service).toBeTruthy();
  });

  it('startTx ', async () => {
    service.startTx(txSend);
    subscription$ = service.inProgress().subscribe((value) => {
      expect(value).toEqual([txSend]);
    });
  });

  it('finishTx', () => {
    service.startTx(txSend);
    service.finishTx(txSend);
    subscription$ = service.inProgress().subscribe((value) => {
      expect(value).toEqual([]);
    });
  });

  it('multiple tx', () => {
    let txCount = 0;
    subscription$ = service.inProgress().subscribe((value) => {
      switch (txCount) {
        case 0:
          expect(value).toEqual([]);
          break;
        case 1:
          expect(value).toEqual([txSend]);
          break;
        case 2:
          expect(value).toEqual([txSend, txSwap]);
          break;
        case 3:
          expect(value).toEqual([txSend]);
          break;
        case 4:
          expect(value).toEqual([]);
          break;
      }
      txCount++;
    });
    service.startTx(txSend);
    service.startTx(txSwap);
    service.finishTx(txSwap);
    service.finishTx(txSend);
  });
});
