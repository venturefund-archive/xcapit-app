import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { FakeWalletService } from 'src/testing/fakes/wallet-service.fake.spec';
import { AssetBalance } from '../../interfaces/asset-balance.interface';
import { ApiWalletService } from '../api-wallet/api-wallet.service';
import { StorageService } from '../storage-wallets/storage-wallets.service';
import { WalletService } from '../wallet/wallet.service';
import { WalletBalanceService } from './wallet-balance.service';

const testUserCoins = [
  {
    id: 2,
    name: 'ETH - Ethereum',
    logoRoute: 'assets/img/coins/ETH.svg',
    last: false,
    value: 'ETH',
    network: 'ERC20',
    chainId: 42,
    rpc: 'http://testrpc.test',
  },
  {
    id: 6,
    name: 'RBTC - Smart Bitcoin',
    logoRoute: 'assets/img/coins/RBTC.png',
    last: false,
    value: 'RBTC',
    network: 'RSK',
    chainId: 31,
    rpc: 'http://testrpc.test',
  },
  {
    id: 3,
    name: 'USDT - Tether',
    logoRoute: 'assets/img/coins/USDT.svg',
    last: false,
    value: 'USDT',
    network: 'ERC20',
    chainId: 42,
    rpc: 'http://testrpc.test',
    decimals: 6,
  },
];

const balances: Array<AssetBalance> = [
  {
    icon: 'assets/img/coins/ETH.svg',
    symbol: 'ETH',
    name: 'ETH - Ethereum',
    amount: 20,
    usdAmount: 60000,
    usdSymbol: 'USD',
  },
  {
    icon: 'assets/img/coins/RBTC.png',
    symbol: 'RBTC',
    name: 'RBTC - Smart Bitcoin',
    amount: 20,
    usdAmount: 1000000,
    usdSymbol: 'USD',
  },
  {
    icon: 'assets/img/coins/USDT.svg',
    symbol: 'USDT',
    name: 'USDT - Tether',
    amount: 20,
    usdAmount: 20,
    usdSymbol: 'USD',
  },
];

const balancesWithoutUsdAmount: Array<AssetBalance> = [
  {
    icon: 'assets/img/coins/ETH.svg',
    symbol: 'ETH',
    name: 'ETH - Ethereum',
    amount: 20,
    usdAmount: 0,
    usdSymbol: 'USD',
  },
  {
    icon: 'assets/img/coins/RBTC.png',
    symbol: 'RBTC',
    name: 'RBTC - Smart Bitcoin',
    amount: 20,
    usdAmount: 0,
    usdSymbol: 'USD',
  },
  {
    icon: 'assets/img/coins/USDT.svg',
    symbol: 'USDT',
    name: 'USDT - Tether',
    amount: 20,
    usdAmount: 0,
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
    fakeWalletService = new FakeWalletService(Promise.resolve(true), Promise.resolve('20'), {
      ERC20: 'testAddress',
      RSK: 'testAddressRSK',
    });
    walletServiceSpy = fakeWalletService.createSpy();

    apiWalletServiceSpy = jasmine.createSpyObj('ApiWalletService', {
      getPrices: of({ prices: { ETH: 3000, BTC: 50000, USDT: 1 } }),
    });

    storageServiceSpy = jasmine.createSpyObj('StorageService', {
      getAssestsSelected: Promise.resolve(testUserCoins),
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

  it('should return balances of user selected coins', async () => {
    const walletBalances = await service.getWalletsBalances();
    expect(walletBalances).toEqual(balances);
  });

  it('should return total balance in USDT', async () => {
    await service.getWalletsBalances();
    const totalBalance = await service.getUsdTotalBalance();
    expect(totalBalance).toEqual(1060020);
  });

  it('should return balances without USD amount when prices not exist', async () => {
    apiWalletServiceSpy.getPrices.and.returnValues(of());
    const balances = await service.getWalletsBalances();
    expect(balances).toEqual(balancesWithoutUsdAmount);
  });

  it('should not return balances when wallet address not exist', async () => {
    fakeWalletService.modifyAttributes({});
    const balances = await service.getWalletsBalances();
    expect(balances).toEqual([]);
  });

  it('should return balance of a coin', async () => {
    await expectAsync(service.balanceOf(testUserCoins[0])).toBeResolvedTo(20);
  });

  it('should return price of a coin', async () => {
    await expectAsync(service.priceOf(testUserCoins[0])).toBeResolvedTo(3000);
  });
});
