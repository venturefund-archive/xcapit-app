import { TokenDetail } from './token-detail';
import { CovalentBalances } from '../balances/covalent-balances/covalent-balances';
import { TokenPrices } from '../prices/token-prices/token-prices';
import { BalanceCacheService } from '../../services/balance-cache/balance-cache.service';
import { DefaultToken, Token } from '../../../../swaps/shared-swaps/models/token/token';
import { rawMATICData } from '../../../../swaps/shared-swaps/models/fixtures/raw-tokens-data';

describe('TokenDetail', () => {
  let token: Token;
  let covalentBalancesSpy: jasmine.SpyObj<CovalentBalances>;
  let tokenPricesSpy: jasmine.SpyObj<TokenPrices>;
  let balanceCacheServiceSpy: jasmine.SpyObj<BalanceCacheService>;

  beforeEach(() => {
    token = new DefaultToken(rawMATICData);
    covalentBalancesSpy = jasmine.createSpyObj('CovalentBalances', {
      value: Promise.resolve([{ coin: rawMATICData, balance: 10 }]),
      valueOf: Promise.resolve({ coin: rawMATICData, balance: 10 }),
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
    expect(new TokenDetail(covalentBalancesSpy, tokenPricesSpy, token, balanceCacheServiceSpy)).toBeTruthy();
  });

  it('should set value', async () => {
    const tokenDetail = new TokenDetail(covalentBalancesSpy, tokenPricesSpy, token, balanceCacheServiceSpy);

    await tokenDetail.fetch();

    expect(tokenDetail.price).toEqual(2);
    expect(tokenDetail.balance).toEqual(10);
    expect(tokenDetail.quoteSymbol).toEqual('USD');
    expect(tokenDetail.token).toEqual(rawMATICData);
  });

  it('should load cached', async () => {
    const tokenDetail = new TokenDetail(covalentBalancesSpy, tokenPricesSpy, token, balanceCacheServiceSpy);

    await tokenDetail.cached();

    expect(tokenDetail.price).toEqual(5);
    expect(tokenDetail.balance).toEqual(20);
    expect(tokenDetail.quoteSymbol).toEqual('USD');
    expect(tokenDetail.token).toEqual(rawMATICData);
  });

  it('should save cache', async () => {
    const tokenDetail = new TokenDetail(covalentBalancesSpy, tokenPricesSpy, token, balanceCacheServiceSpy);

    await tokenDetail.fetch();
    await tokenDetail.cache();

    expect(balanceCacheServiceSpy.updateCoin).toHaveBeenCalledOnceWith(rawMATICData, { price: 2, balance: 10 });
  });

  it('should not load cache if empty', async () => {
    balanceCacheServiceSpy.coin.and.returnValue(Promise.resolve(undefined));
    const tokenDetail = new TokenDetail(covalentBalancesSpy, tokenPricesSpy, token, balanceCacheServiceSpy);

    await tokenDetail.cached();

    expect(tokenDetail.price).toEqual(0);
    expect(tokenDetail.balance).toEqual(0);
    expect(tokenDetail.quoteSymbol).toEqual('USD');
    expect(tokenDetail.token).toEqual(rawMATICData);
  });
});
