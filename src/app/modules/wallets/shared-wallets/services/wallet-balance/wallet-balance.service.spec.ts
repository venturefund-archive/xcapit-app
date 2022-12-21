import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { FakeWalletService } from 'src/testing/fakes/wallet-service.fake.spec';
import { ApiWalletService } from '../api-wallet/api-wallet.service';
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

describe('WalletBalanceService', () => {
  let service: WalletBalanceService;
  let fakeWalletService: FakeWalletService;
  let walletServiceSpy: jasmine.SpyObj<WalletService>;
  let apiWalletServiceSpy: jasmine.SpyObj<ApiWalletService>;

  beforeEach(() => {
    fakeWalletService = new FakeWalletService(Promise.resolve(true), Promise.resolve('20'), {
      ERC20: 'testAddress',
      RSK: 'testAddressRSK',
    });
    walletServiceSpy = fakeWalletService.createSpy();

    apiWalletServiceSpy = jasmine.createSpyObj('ApiWalletService', {
      getPrices: of({ prices: { ETH: 3000, BTC: 50000, USDT: 1 } }),
    });

    TestBed.configureTestingModule({
      providers: [
        { provide: WalletService, useValue: walletServiceSpy },
        { provide: ApiWalletService, useValue: apiWalletServiceSpy },
      ],
    });

    service = TestBed.inject(WalletBalanceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return balance of a coin', async () => {
    await expectAsync(service.balanceOf(testUserCoins[0])).toBeResolvedTo(20);
  });

  it('should return price of a coin', async () => {
    await expectAsync(service.priceOf(testUserCoins[0])).toBeResolvedTo(3000);
  });
});
