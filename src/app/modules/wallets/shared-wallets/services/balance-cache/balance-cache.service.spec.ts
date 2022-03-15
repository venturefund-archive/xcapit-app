import { WalletService } from 'src/app/modules/wallets/shared-wallets/services/wallet/wallet.service';
import { TestBed } from '@angular/core/testing';
import { BalanceCacheService, BalanceOrPrice, CachedCoin } from './balance-cache.service';
import { CacheService } from '../../../../../shared/services/cache/cache.service';
import { Coin } from '../../interfaces/coin.interface';

const testCoin: Coin = {
  id: 0,
  name: 'ETH - Ethereum',
  logoRoute: 'assets/img/coins/ETH.svg',
  last: false,
  value: 'ETH',
  network: 'ERC20',
  chainId: 42,
  rpc: 'http://testrpc.test/',
  native: true,
};

const cachedCoin: CachedCoin = { balance: 10, price: 5, expiration_date: 1234 };

const balanceAndPrice: BalanceOrPrice = { balance: 2, price: 4 };
const priceOnly: BalanceOrPrice = { price: 4 };
const balanceOnly: BalanceOrPrice = { balance: 2 };

describe('BalanceCacheService', () => {
  let service: BalanceCacheService;
  let cacheServiceSpy: jasmine.SpyObj<CacheService>;
  let walletServiceSpy: jasmine.SpyObj<WalletService>;

  beforeEach(() => {
    cacheServiceSpy = jasmine.createSpyObj('CacheService', {
      update: Promise.resolve(),
      get: Promise.resolve({ value: 50, expiration_date: 123456 }),
      remove: Promise.resolve(),
    });
    walletServiceSpy = jasmine.createSpyObj('WalletServiceSpy', {
      walletExist: Promise.resolve(true),
    });
    TestBed.configureTestingModule({
      providers: [
        { provide: CacheService, useValue: cacheServiceSpy },
        { provide: WalletService, useValue: walletServiceSpy },
      ],
    });
    service = TestBed.inject(BalanceCacheService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should update total balance if wallet exists', async () => {
    await service.updateTotal(50);
    expect(cacheServiceSpy.update).toHaveBeenCalledWith('balance_total', { value: 50 });
  });

  it('should update total balance if wallet not exist', async () => {
    walletServiceSpy.walletExist.and.returnValue(Promise.resolve(false));
    await service.updateTotal(50);
    expect(cacheServiceSpy.update).not.toHaveBeenCalled();
  });

  it('should get total balance', async () => {
    await expectAsync(service.total()).toBeResolvedTo(50);
    expect(cacheServiceSpy.get).toHaveBeenCalledWith('balance_total');
  });

  it('should get coin balance', async () => {
    cacheServiceSpy.get.and.resolveTo(cachedCoin);
    await expectAsync(service.coin(testCoin)).toBeResolvedTo({ balance: 10, price: 5, expiration_date: 1234 });
    expect(cacheServiceSpy.get).toHaveBeenCalledWith('balance_ERC20_ETH');
  });

  it('should update coin with both, price and balance', async () => {
    await service.updateCoin(testCoin, balanceAndPrice);

    expect(cacheServiceSpy.get).toHaveBeenCalledOnceWith('balance_ERC20_ETH');
    expect(cacheServiceSpy.update).toHaveBeenCalledWith('balance_ERC20_ETH', balanceAndPrice);
  });

  it('should update coin with price only', async () => {
    await service.updateCoin(testCoin, priceOnly);

    expect(cacheServiceSpy.get).toHaveBeenCalledOnceWith('balance_ERC20_ETH');
    expect(cacheServiceSpy.update).toHaveBeenCalledWith('balance_ERC20_ETH', { balance: undefined, price: 4 });
  });

  it('should update coin with balance only', async () => {
    await service.updateCoin(testCoin, balanceOnly);

    expect(cacheServiceSpy.get).toHaveBeenCalledOnceWith('balance_ERC20_ETH');
    expect(cacheServiceSpy.update).toHaveBeenCalledWith('balance_ERC20_ETH', { balance: 2, price: undefined });
  });

  it('should remove total balance', async () => {
    await service.removeTotal();
    expect(cacheServiceSpy.remove).toHaveBeenCalledWith('balance_total');
  });
});
