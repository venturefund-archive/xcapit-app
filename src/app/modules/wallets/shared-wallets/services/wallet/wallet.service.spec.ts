import { TestBed } from '@angular/core/testing';
import {  Wallet } from 'ethers';
import { WalletService } from './wallet.service';
import { BlockchainProviderService } from '../blockchain-provider/blockchain-provider.service';
import { StorageService } from '../storage-wallets/storage-wallets.service';


describe('WalletService', () => {
  const testWallet: Wallet = { address: 'testAddress' } as Wallet;
  let service: WalletService;
  let blockchainProviderServiceMock;
  let blockchainProviderService: BlockchainProviderService;
  let storageServiceSpy: jasmine.SpyObj<StorageService>;
  beforeEach(() => {
    blockchainProviderServiceMock = {
      getFormattedBalanceOf: (address: string, asset: string) => Promise.resolve('20'),
    };
    storageServiceSpy = jasmine.createSpyObj('StorageService', {
      getWalletFromStorage: Promise.resolve(testWallet),
    });
    TestBed.configureTestingModule({
      providers: [
        { provide: BlockchainProviderService, useValue: blockchainProviderServiceMock },
        { provide: StorageService, useValue: storageServiceSpy },
      ],
    });
    service = TestBed.inject(WalletService);
    blockchainProviderService = TestBed.inject(BlockchainProviderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call provider get balance when balanceOf is called', async () => {
    const spy = spyOn(blockchainProviderService, 'getFormattedBalanceOf').and.returnValue(Promise.resolve('20'));
    const response = service.balanceOf('testAddress', 'testCoin', 'testNetwork');
    expect(spy).toHaveBeenCalledWith('testAddress', 'testCoin', 'testNetwork');
    await expectAsync(response).toBeResolvedTo('20');
  });

  it('should return true if wallet exists', async () =>{
    expect(await service.walletExist()).toBeTrue();
  })
});
