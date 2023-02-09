import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Subscription } from 'rxjs';
import { IonicStorageService } from 'src/app/shared/services/ionic-storage/ionic-storage.service';
import { TxInProgressService } from './tx-in-progress.service';
import { SendTxInProgress } from '../../../../users/shared-users/models/tx-in-progress/send/send-tx-in-progress';
import { SwapTxInProgress } from '../../../../users/shared-users/models/tx-in-progress/swap/swap-tx-in-progress';
import { TxInProgress } from '../../../../users/shared-users/models/tx-in-progress/tx-in-progress.interface';
import { BlockchainTransactionResponsesInjectable } from 'src/app/modules/wallets/shared-wallets/models/blockchain-transactions/injectable/blockchain-transaction-responses.injectable';
import { rawSendTxInProgress } from '../../../../wallets/shared-wallets/fixtures/raw-send-tx-in-progress';
import { rawSwapTxInProgress } from '../../../../wallets/shared-wallets/fixtures/raw-swap-tx-in-progress';
import { BlockchainTransactionResponses } from '../../../../wallets/shared-wallets/models/blockchain-transactions/blockchain-transaction-responses';
import { FakeTransactionResponse } from '../../../../wallets/shared-wallets/models/transaction-response/fake/fake-transaction-response';
import { JsonRpcProviderInjectable } from '../../../../wallets/shared-wallets/models/json-rpc-provider/injectable/json-rpc-provider.injectable';
import { BlockchainsFactory } from '../../models/blockchains/factory/blockchains.factory';
import { DefaultBlockchains } from '../../models/blockchains/blockchains';
import { BlockchainRepo } from '../../models/blockchain-repo/blockchain-repo';
import { rawBlockchainsData } from '../../models/fixtures/raw-blockchains-data';
import { FakeAppStorage } from 'src/app/shared/services/app-storage/app-storage.service';
import { DefaultTxHash } from 'src/app/modules/wallets/shared-wallets/models/tx-hash/default/default-tx-hash';

describe('TxInProgressService', () => {
  let service: TxInProgressService;

  let subscription$: Subscription;
  let txSend: TxInProgress;
  let txSwap: TxInProgress;
  let blockchainTransactionsInjectableSpy: jasmine.SpyObj<BlockchainTransactionResponsesInjectable>;
  let jsonRpcProviderInjectableSpy: jasmine.SpyObj<JsonRpcProviderInjectable>;
  let blockchainTransactionsSpy: jasmine.SpyObj<BlockchainTransactionResponses>;
  let blockchainsFactorySpy: jasmine.SpyObj<BlockchainsFactory>;
  let fakeStorage: FakeAppStorage;
  const blockchains = new DefaultBlockchains(new BlockchainRepo(rawBlockchainsData));
  const storageKey = 'in_progress_transactions';

  beforeEach(() => {
    txSend = new SendTxInProgress(
      blockchains.oneByName('MATIC'),
      new DefaultTxHash(rawSendTxInProgress.hash),
      new Date(rawSendTxInProgress.timestamp)
    );
    txSwap = new SwapTxInProgress(blockchains.oneByName('MATIC'), new Date(rawSwapTxInProgress.timestamp));

    fakeStorage = new FakeAppStorage({ [storageKey]: [rawSendTxInProgress, rawSwapTxInProgress] });

    jsonRpcProviderInjectableSpy = jasmine.createSpyObj('JsonRpcProviderInjectable', {
      create: { getTransaction: (hash) => Promise.resolve(new FakeTransactionResponse()) },
    });

    blockchainTransactionsSpy = jasmine.createSpyObj('BlockchainTransactions', {
      byHash: new FakeTransactionResponse(),
    });

    blockchainTransactionsInjectableSpy = jasmine.createSpyObj('BlockchainTransactionsInjectable', {
      create: blockchainTransactionsSpy,
    });

    blockchainsFactorySpy = jasmine.createSpyObj('BlockchainsFactory', {
      create: blockchains,
    });

    TestBed.configureTestingModule({
      providers: [
        { provide: IonicStorageService, useValue: fakeStorage },
        { provide: BlockchainTransactionResponsesInjectable, useValue: blockchainTransactionsInjectableSpy },
        { provide: JsonRpcProviderInjectable, useValue: jsonRpcProviderInjectableSpy },
        { provide: BlockchainsFactory, useValue: blockchainsFactorySpy },
      ],
    });
    service = TestBed.inject(TxInProgressService);
  });

  afterEach(() => {
    if (subscription$) subscription$.unsubscribe();
  });

  it('should be created', () => {
    subscription$ = service.inProgress().subscribe((value) => {
      expect(value).toEqual([]);
    });
    expect(service).toBeTruthy();
  });

  it('startTx ', async () => {
    await service.startTx(txSend);
    subscription$ = service.inProgress().subscribe((value) => {
      expect(value).toEqual([txSend]);
    });
  });

  it('finishTx', async () => {
    await service.startTx(txSend);
    await service.finishTx(txSend);
    subscription$ = service.inProgress().subscribe((value) => {
      expect(value).toEqual([]);
    });
  });

  it('checkTransactionStatus', fakeAsync(async () => {
    await service.checkTransactionStatus();
    tick();
    expect(await fakeStorage.get(storageKey)).toEqual([]);
  }));

  it('checkTransactionStatus without in blockchain transaction',fakeAsync( async () => {
    blockchainTransactionsSpy.byHash.and.returnValue(Promise.resolve(new FakeTransactionResponse(Promise.reject())));
    await service.checkTransactionStatus();
    tick();
    expect(await fakeStorage.get(storageKey)).toEqual([]);
  }));

  it('checkTransactionStatus without storage key', async () => {
    await fakeStorage.set(storageKey, null);
    await service.checkTransactionStatus();
    expect(await fakeStorage.get(storageKey)).toEqual(null);
  });

  it('multiple tx', async () => {
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
    await service.startTx(txSend);
    await service.startTx(txSwap);
    await service.finishTx(txSwap);
    await service.finishTx(txSend);
  });
});
