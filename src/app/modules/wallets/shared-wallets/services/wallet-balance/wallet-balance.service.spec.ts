import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { FakeWalletService } from 'src/testing/fakes/wallet-service.fake.spec';
import { AssetBalance } from '../../interfaces/asset-balance.interface';
import { ApiWalletService } from '../api-wallet/api-wallet.service';
import { StorageService } from '../storage-wallets/storage-wallets.service';
import { WalletService } from '../wallet/wallet.service';
import { WalletBalanceService } from './wallet-balance.service';

const balancesTest: Array<AssetBalance> = [
  {
    icon: 'assets/img/coins/LINK.svg',
    symbol: 'LINK',
    name: 'LINK - Chainlink',
    amount: 0.005,
    usdAmount: 120,
    usdSymbol: 'USD',
  },
  {
    icon: 'assets/img/coins/ETH.svg',
    symbol: 'ETH',
    name: 'ETH - Ethereum',
    amount: 1,
    usdAmount: 2000,
    usdSymbol: 'USD',
  },
  {
    icon: 'assets/img/coins/USDT.svg',
    symbol: 'USDT',
    name: 'USDT - Tether',
    amount: 2,
    usdAmount: 3000,
    usdSymbol: 'USD',
  },
];

const testCoins = {
  test: [
    {
      id: 1,
      name: 'coinTest',
      logoRoute: '../../assets/img/coins/ETH.svg',
      last: false,
      value: 'coinTest',
      network: 'ERC20',
      chainId: 42,
      rpc: 'http://testrpc.test',
    },
  ],
  usdBalanceTest: [
    {
      id: 2,
      name: 'ETH - Ethereum',
      logoRoute: '../../assets/img/coins/ETH.svg',
      last: false,
      value: 'ETH',
      network: 'ETH',
      chainId: 42,
      rpc: 'http://testrpc.test',
    },
    {
      id: 6,
      name: 'RBTC - Smart Bitcoin',
      logoRoute: '../../assets/img/coins/RBTC.png',
      last: false,
      value: 'RBTC',
      network: 'RSK',
      chainId: 31,
      rpc: 'http://testrpc.test',
    },
    {
      id: 3,
      name: 'USDT - Tether',
      logoRoute: '../../assets/img/coins/USDT.svg',
      last: false,
      value: 'USDT',
      network: 'ETH',
      chainId: 42,
      rpc: 'http://testrpc.test',
      decimals: 6,
    },
  ],
};

const OrderedBalances: Array<AssetBalance> = [
  {
    icon: '../../assets/img/coins/RBTC.png',
    symbol: 'RBTC',
    name: 'RBTC - Smart Bitcoin',
    amount: 20,
    usdAmount: 1000000,
    usdSymbol: 'USD',
  },
  {
    icon: '../../assets/img/coins/ETH.svg',
    symbol: 'ETH',
    name: 'ETH - Ethereum',
    amount: 20,
    usdAmount: 60000,
    usdSymbol: 'USD',
  },
  {
    icon: '../../assets/img/coins/USDT.svg',
    symbol: 'USDT',
    name: 'USDT - Tether',
    amount: 20,
    usdAmount: 20,
    usdSymbol: 'USD',
  },
];

describe('WalletBalanceService', () => {
  let service: WalletBalanceService;
  let fakeWalletService: FakeWalletService;
  let walletServiceSpy: jasmine.SpyObj<WalletService>;
  let apiWalletServiceSpy: jasmine.SpyObj<ApiWalletService>;
  let storageServiceSpy: jasmine.SpyObj<StorageService>;

  beforeEach(() => {
    fakeWalletService = new FakeWalletService(Promise.resolve(true), Promise.resolve('20'), { ERC20: 'testAddress' });
    walletServiceSpy = fakeWalletService.createSpy();
    apiWalletServiceSpy = jasmine.createSpyObj('ApiWalletService', {
      getPrices: of({ prices: { ETH: 3000, BTC: 50000, USDT: 1 } }),
      getNFTStatus: of({ status: 'claimed' }),
      createNFTRequest: of({}),
    });
    storageServiceSpy = jasmine.createSpyObj('StorageService', {
      getAssestsSelected: Promise.resolve(testCoins.test),
      updateAssetsList: Promise.resolve(true),
    });
    TestBed.configureTestingModule({
      providers: [
        { provide: WalletService, useValue: walletServiceSpy },
        { provide: ApiWalletService, useValue: apiWalletServiceSpy },
        { provide: StorageService, useValue: storageServiceSpy },
      ],
    });

    service = TestBed.inject(WalletBalanceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get coins balance', async () => {});

  it('should get total balance', async () => {});

  // it('should order balances by amount', async () => {
  //   fakeWalletService.modifyAttributes({
  //     ETH: 'testAddressEth',
  //     RSK: 'testAddressRsk',
  //   });
  //   component.userCoins = testCoins.usdBalanceTest;
  //   component.allPrices = { prices: { ETH: 3000, BTC: 50000, USDT: 1 } };
  //   fixture.detectChanges();
  //   await component.getWalletsBalances();
  //   expect(component.balances).toEqual(OrderedBalances);
  // });
});
