import { TestBed } from '@angular/core/testing';
import { WalletTransactionsService } from './wallet-transactions.service';
import { LoadingService } from '../../../../../shared/services/loading/loading.service';
import { WalletEncryptionService } from '../wallet-encryption/wallet-encryption.service';
import { BlockchainProviderService } from '../brockchain-provider/blockchain-provider.service';
import { Coin } from '../../interfaces/coin.interface';
import { ethers } from 'ethers';
const coin: Coin = {
  id: 4,
  name: 'ETH - Ethereum',
  logoRoute: '../../assets/img/coins/ETH.svg',
  last: true,
  value: 'ETH',
  network: '',
  rpc: '',
};

describe('WalletTransactionsService', () => {
  let service: WalletTransactionsService;
  let loadingServiceSpy: any;
  let walletEncryptionServiceMock: any;
  let blockchainProviderServiceMock: any;
  let sendTransactionSpy: any;

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
    TestBed.configureTestingModule({
      providers: [
        { provide: LoadingService, useValue: loadingServiceSpy },
        { provide: WalletEncryptionService, useValue: walletEncryptionServiceMock },
        { provide: BlockchainProviderService, useValue: blockchainProviderServiceMock },
      ],
    });
    service = TestBed.inject(WalletTransactionsService);
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
});
