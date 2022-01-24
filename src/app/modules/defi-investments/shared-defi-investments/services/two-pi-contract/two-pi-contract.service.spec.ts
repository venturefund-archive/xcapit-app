import { ComponentFixtureAutoDetect, TestBed } from '@angular/core/testing';
import { Vault } from '@2pi-network/sdk';
import { TwoPiContractService } from './two-pi-contract.service';
import { ApiWalletService } from 'src/app/modules/wallets/shared-wallets/services/api-wallet/api-wallet.service';
import { TwoPiProduct } from '../../models/two-pi-investment-product/two-pi-product.model';
import { BlockchainProviderService } from 'src/app/modules/wallets/shared-wallets/services/blockchain-provider/blockchain-provider.service';
import { BigNumber, Contract } from 'ethers';
import { StorageService } from 'src/app/modules/wallets/shared-wallets/services/storage-wallets/storage-wallets.service';

const usdc_coin = {
  id: 8,
  name: 'USDC - USD Coin',
  logoRoute: 'assets/img/coins/USDC.png',
  last: false,
  value: 'USDC',
  network: 'MATIC',
  chainId: 80001,
  rpc: 'http://testrpc.text/',
  moonpayCode: 'usdc_polygon',
  decimals: 6,
  symbol: 'USDCUSDT',
};

const testVault = {
  apy: 0.227843965358873,
  identifier: 'polygon_usdc',
  tokenDecimals: 6,
  pid: 1,
  token: 'USDC',
  tvl: 1301621680000,
} as Vault;

describe('TwoPiContractService', () => {
  let service: TwoPiContractService;
  let apiWalletServiceSpy: jasmine.SpyObj<ApiWalletService>;
  let blockchainProviderServiceSpy: jasmine.SpyObj<BlockchainProviderService> ;
  let contractSpy: jasmine.SpyObj<any>;
  let storageServiceSpy: jasmine.SpyObj<StorageService>;
  beforeEach(() => {
    storageServiceSpy = jasmine.createSpyObj('StorageService', {
      getWalletFromStorage : Promise.resolve({addresses: { MATIC: 'testAddressMatic' }}) 
    })
    contractSpy = jasmine.createSpyObj('Contract', {
      balanceOf : Promise.resolve(BigNumber.from(50))
    })
    blockchainProviderServiceSpy = jasmine.createSpyObj('BlockchainProviderService',{
      createContract :  contractSpy,
      createProvider : Promise.resolve({})
    })
    apiWalletServiceSpy = jasmine.createSpyObj('ApiWalletServiceSpy', {
      getCoins: [usdc_coin],
    });
    TestBed.configureTestingModule({
      providers:[{provide : StorageService, useValue : storageServiceSpy}, {provide: BlockchainProviderService, useValue : blockchainProviderServiceSpy}]
    });
    service = TestBed.inject(TwoPiContractService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return the users balance for an investment product when balance method is executed.',async () => {
    const investmentProduct = new TwoPiProduct(testVault, apiWalletServiceSpy);
    await expectAsync(service.balance(investmentProduct)).toBeResolvedTo(50);
  });
});
