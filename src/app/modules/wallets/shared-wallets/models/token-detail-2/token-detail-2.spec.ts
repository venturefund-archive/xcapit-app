import { Coin } from '../../interfaces/coin.interface';
import { TokenDetail2 } from './token-detail-2';
import { CovalentBalances } from '../covalent-balances/covalent-balances';
import { TokenPrices } from '../token-prices/token-prices';

fdescribe('TokenDetail2', () => {
  let maticSpy: jasmine.SpyObj<Coin>;
  let covalentBalancesSpy: jasmine.SpyObj<CovalentBalances>;
  let tokenPricesSpy: jasmine.SpyObj<TokenPrices>;

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
  });

  it('should create', () => {
    expect(new TokenDetail2(covalentBalancesSpy, tokenPricesSpy, maticSpy)).toBeTruthy();
  });

  it('should get value', async () => {
    const tokenDetail = new TokenDetail2(covalentBalancesSpy, tokenPricesSpy, maticSpy);
    await tokenDetail.fetch();
    expect(tokenDetail.price).toEqual(2);
    expect(tokenDetail.balance).toEqual(10);
    expect(tokenDetail.quoteSymbol).toEqual('USD');
    expect(tokenDetail.coin).toEqual(maticSpy);
  });
});
