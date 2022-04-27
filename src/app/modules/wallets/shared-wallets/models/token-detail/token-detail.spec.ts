import { Coin } from '../../interfaces/coin.interface';
import { TokenDetail } from './token-detail';
import { CovalentBalances } from '../balances/covalent-balances/covalent-balances';
import { TokenPrices } from '../prices/token-prices/token-prices';
import { BalanceCacheService } from '../../services/balance-cache/balance-cache.service';

describe('TokenDetail', () => {
  let maticSpy: jasmine.SpyObj<Coin>;
  let covalentBalancesSpy: jasmine.SpyObj<CovalentBalances>;
  let tokenPricesSpy: jasmine.SpyObj<TokenPrices>;
  let balanceCacheServiceSpy: jasmine.SpyObj<BalanceCacheService>;

  beforeEach(() => {
    maticSpy = jasmine.createSpyObj('MATIC', {}, { value: 'MATIC', decimals: 6 });
    covalentBalancesSpy = jasmine.createSpyObj('CovalentBalances', {
      value: Promise.resolve([{ coin: maticSpy, balance: 10 }]),
      valueOf: Promise.resolve({ coin: maticSpy, balance: 10 }),
    });
    tokenPricesSpy = jasmine.createSpyObj('TokenPrices', {
      value: Promise.resolve({ USDC: 1, MATIC: 2 }),
      valueOf: Promise.resolve(2),
    });
    balanceCacheServiceSpy = jasmine.createSpyObj('BalanceCacheService', {
      updateCoin: Promise.resolve(),
      coin: { balance: 20, price: 5 },
    });
  });

  it('should create', () => {
    expect(new TokenDetail(covalentBalancesSpy, tokenPricesSpy, maticSpy, balanceCacheServiceSpy)).toBeTruthy();
  });

  it('should set value', async () => {
    const tokenDetail = new TokenDetail(covalentBalancesSpy, tokenPricesSpy, maticSpy, balanceCacheServiceSpy);
    await tokenDetail.fetch();
    expect(tokenDetail.price).toEqual(2);
    expect(tokenDetail.balance).toEqual(10);
    expect(tokenDetail.quoteSymbol).toEqual('USD');
    expect(tokenDetail.coin).toEqual(maticSpy);
  });

  it('should load cached', async () => {
    const tokenDetail = new TokenDetail(covalentBalancesSpy, tokenPricesSpy, maticSpy, balanceCacheServiceSpy);
    await tokenDetail.cached();
    expect(tokenDetail.price).toEqual(5);
    expect(tokenDetail.balance).toEqual(20);
    expect(tokenDetail.quoteSymbol).toEqual('USD');
    expect(tokenDetail.coin).toEqual(maticSpy);
  });

  it('should save cache', async () => {
    const tokenDetail = new TokenDetail(covalentBalancesSpy, tokenPricesSpy, maticSpy, balanceCacheServiceSpy);
    await tokenDetail.fetch();
    await tokenDetail.cache();
    expect(balanceCacheServiceSpy.updateCoin).toHaveBeenCalledOnceWith(maticSpy, { price: 2, balance: 10 });
  });

  it('should not load cache if empty', async () => {
    balanceCacheServiceSpy.coin.and.returnValue(Promise.resolve(undefined));
    const tokenDetail = new TokenDetail(covalentBalancesSpy, tokenPricesSpy, maticSpy, balanceCacheServiceSpy);
    await tokenDetail.cached();
    expect(tokenDetail.price).toEqual(0);
    expect(tokenDetail.balance).toEqual(0);
    expect(tokenDetail.quoteSymbol).toEqual('USD');
    expect(tokenDetail.coin).toEqual(maticSpy);
  });
});
