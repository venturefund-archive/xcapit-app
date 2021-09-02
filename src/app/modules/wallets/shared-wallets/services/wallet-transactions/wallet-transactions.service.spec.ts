import { TestBed } from '@angular/core/testing';
import { WalletTransactionsService } from './wallet-transactions.service';
import { LoadingService } from '../../../../../shared/services/loading/loading.service';
import { WalletEncryptionService } from '../wallet-encryption/wallet-encryption.service';
import { BlockchainProviderService } from '../brockchain-provider/blockchain-provider.service';
import { Coin } from '../../interfaces/coin.interface';
import { ethers } from 'ethers';
import { TranslateModule } from '@ngx-translate/core';
import { Storage } from '@ionic/storage';
import { StorageService } from '../storage-wallets/storage-wallets.service';
import { of } from 'rxjs';
import { CustomHttpService } from 'src/app/shared/services/custom-http/custom-http.service';

const coin: Coin = {
  id: 4,
  name: 'ETH - Ethereum',
  logoRoute: '../../assets/img/coins/ETH.svg',
  last: true,
  value: 'ETH',
  network: '',
  rpc: '',
};

const testAddresses = { ETH_TEST: 'testAddress' };

const alchemyTransaction1 = {
  result: {
    transfers: [
      {
        asset: 'ETH',
        blockNum: '0xafafaa',
        category: 'external',
        erc721TokenId: null,
        from: '0x7c0c6bb31987b86f8e2879e17b65c6761f14bec9',
        hash: '0xf07807604443ccf3d533ba3ddb17163537f853e6be128a3f39854a37b9cdb1fe',
        rawContract: {
          address: null,
          decimal: '0x12',
          value: '0x35ef7aa21505800',
        },
        to: '0x9cbb2b28df12a6f520cfd4a97b8c89f89ee10c59',
        value: 0.24290374,
      },
    ],
  },
};

const alchemyTransaction2 = {
  result: {
    transfers: [
      {
        asset: 'USDT',
        blockNum: '0xafafad',
        category: 'external',
        erc721TokenId: null,
        from: '0x9cbb2b28df12a6f520cfd4a97b8c89f89ee10c59',
        hash: '0xf07807604443ccf3d533ba3ddb17163537f853e6be128a3f39854a37b9fffff',
        rawContract: {
          address: null,
          decimal: '0x12',
          value: '0x35ef7aa21505800',
        },
        to: '0x7c0c6bb31987b86f8e2879e17b65c6761f14bec9',
        value: 0.24290374,
      },
    ],
  },
};

const testStructure = [
  {
    asset: 'USDT',
    blockNumber: '0xafafad',
    erc721: null,
    from: '0x9cbb2b28df12a6f520cfd4a97b8c89f89ee10c59',
    hash: '0xf07807604443ccf3d533ba3ddb17163537f853e6be128a3f39854a37b9fffff',
    icon: 'assets/img/wallet-transactions/sended.svg',
    rawContract: false,
    swap: {
      amounOut: null,
      amountIn: null,
      currencyIn: '',
      currencyOut: '',
    },
    to: '0x7c0c6bb31987b86f8e2879e17b65c6761f14bec9',
    type: 'sended',
    value: 0.24290374,
  },
  {
    asset: 'ETH',
    blockNumber: '0xafafaa',
    erc721: null,
    from: '0x7c0c6bb31987b86f8e2879e17b65c6761f14bec9',
    hash: '0xf07807604443ccf3d533ba3ddb17163537f853e6be128a3f39854a37b9cdb1fe',
    icon: 'assets/img/wallet-transactions/received.svg',
    rawContract: false,
    swap: {
      amounOut: null,
      amountIn: null,
      currencyIn: '',
      currencyOut: '',
    },
    to: '0x9cbb2b28df12a6f520cfd4a97b8c89f89ee10c59',
    type: 'received',
    value: 0.24290374,
  },
];

describe('WalletTransactionsService', () => {
  let service: WalletTransactionsService;
  let loadingServiceSpy: any;
  let walletEncryptionServiceMock: any;
  let blockchainProviderServiceMock: any;
  let sendTransactionSpy: any;
  let storageServiceMock: any;
  let storageService: StorageService;
  let storageSpy: any;
  let customHttpServiceSpy;

  beforeEach(() => {
    loadingServiceSpy = jasmine.createSpyObj('LoadingService', {
      show: () => Promise.resolve(),
      dismiss: () => Promise.resolve(),
    });

    sendTransactionSpy = jasmine.createSpy('sendTransaction');
    walletEncryptionServiceMock = {
      getDecryptedWallet: () => Promise.resolve({ connect: () => ({ sendTransaction: sendTransactionSpy }) }),
    };

    blockchainProviderServiceMock = {
      getProvider: () => Promise.resolve({ provider: {} }),
    };

    storageSpy = jasmine.createSpyObj('Storage', ['get', 'set']);

    storageServiceMock = {
      getWalletsAddresses: () => Promise.resolve(testAddresses),
    };

    customHttpServiceSpy = jasmine.createSpyObj('CustomHttpService', {
      post: of(),
    });
    TestBed.configureTestingModule({
      providers: [
        { provide: LoadingService, useValue: loadingServiceSpy },
        { provide: WalletEncryptionService, useValue: walletEncryptionServiceMock },
        { provide: BlockchainProviderService, useValue: blockchainProviderServiceMock },
        { provide: Storage, useValue: storageSpy },
        { provide: StorageService, useValue: storageServiceMock },
        { provide: CustomHttpService, useValue: customHttpServiceSpy },
      ],
    });
    service = TestBed.inject(WalletTransactionsService);
    storageService = TestBed.inject(StorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should send transaction', async () => {
    await service.send('testPassword', '20', 'testAddress', coin);
    expect(sendTransactionSpy).toHaveBeenCalledOnceWith({
      to: 'testAddress',
      value: ethers.utils.parseEther('20'),
    });
    expect(loadingServiceSpy.dismiss).toHaveBeenCalledTimes(1);
    expect(loadingServiceSpy.show).toHaveBeenCalledTimes(1);
  });

  it('should not call loading when loading is false', async () => {
    await service.send('testPassword', '20', 'testAddress', coin, false);
    expect(sendTransactionSpy).toHaveBeenCalledOnceWith({
      to: 'testAddress',
      value: ethers.utils.parseEther('20'),
    });
    expect(loadingServiceSpy.dismiss).toHaveBeenCalledTimes(1);
  });

  it('should be return a mapped structure when mapResponse', () => {
    const mapResponse = service.mapResponse(alchemyTransaction1.result.transfers, 'received');

    expect(mapResponse).toEqual([testStructure[1]]);
  });

  it('should be return a merged structure when mergeTransactions', () => {
    const received = service.mapResponse(alchemyTransaction1.result.transfers, 'received');
    const sended = service.mapResponse(alchemyTransaction2.result.transfers, 'sended');

    const merged = service.mergeTransactions(received, sended);

    expect(merged).toEqual(testStructure);
  });

  it('should be return a mapped and merged struture when getTransactions', () => {
    customHttpServiceSpy.post.and.returnValues(of(alchemyTransaction1), of(alchemyTransaction2));

    service.getTransactions('testAddress', 'testProvider').subscribe((res) => {
      expect(res).toEqual(testStructure);
    });
  });

  it('should be return all transactions of an ethereum wallet when getAllTransactions', async () => {
    customHttpServiceSpy.post.and.returnValues(of(alchemyTransaction1), of(alchemyTransaction2));

    const allTransactions = await service.getAllTransactions();

    expect(allTransactions).toEqual(testStructure);
  });

  it('should be return the last transaction of an ethereum wallet when getLastTransaction', async () => {
    customHttpServiceSpy.post.and.returnValues(of(alchemyTransaction1), of(alchemyTransaction2));

    const lastTransaction = await service.getLastTransaction();

    expect(lastTransaction).toEqual([testStructure[0]]);
  });
});
