import { CovalentBalances } from '../balances/covalent-balances/covalent-balances';
import { TokenPrices } from '../token-prices/token-prices';
import { TokenDetailList } from './token-detail-list';
import { Coin } from '../../interfaces/coin.interface';

describe('TokenDetailList', () => {
  let tokenBalances: jasmine.SpyObj<CovalentBalances>;
  let tokenPrices: jasmine.SpyObj<TokenPrices>;
  let usdcSpy: jasmine.SpyObj<Coin>;
  let maticSpy: jasmine.SpyObj<Coin>;
  beforeEach(() => {
    usdcSpy = jasmine.createSpyObj('USDC', {}, { value: 'USDC' });
    maticSpy = jasmine.createSpyObj('MATIC', {}, { value: 'MATIC' });

    tokenBalances = jasmine.createSpyObj('CovalentBalances', {
      value: Promise.resolve([
        { coin: usdcSpy, balance: '1000000' },
        { coin: maticSpy, balance: '200000000' },
      ]),
    });
    tokenPrices = jasmine.createSpyObj('TokenPrices', { value: Promise.resolve({ USDC: 1, MATIC: 2 }) });
  });

  it('should create', () => {
    expect(new TokenDetailList(tokenBalances, tokenPrices)).toBeTruthy();
  });

  it('should get all', async () => {
    expect((await new TokenDetailList(tokenBalances, tokenPrices).all()).length).toEqual(2);
  });
});
