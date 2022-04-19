import { Coin } from '../../interfaces/coin.interface';
import { TokenDetail } from './token-detail';

describe('TokenDetail', () => {
  let balanceSpy: jasmine.SpyObj<any>;
  let usdcSpy: jasmine.SpyObj<Coin>;

  beforeEach(() => {
    usdcSpy = jasmine.createSpyObj('USDC', {}, { value: 'USDC', decimals: 6 });
    balanceSpy = jasmine.createSpyObj('Balance', {}, { coin: usdcSpy, balance: '1000000' });
  });

  it('should create', () => {
    expect(new TokenDetail(balanceSpy, 1)).toBeTruthy();
  });

  it('should get value', () => {
    expect(new TokenDetail(balanceSpy, 1).value()).toEqual({
      quoteSymbol: 'USD',
      amount: 1,
      coin: usdcSpy,
      price: 1,
    });
  });
});
