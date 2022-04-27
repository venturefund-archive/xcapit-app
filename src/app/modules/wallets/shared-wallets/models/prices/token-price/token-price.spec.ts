import { Coin } from '../../../interfaces/coin.interface';
import { TokenPrice } from './token-price';
import { TokenPrices } from '../token-prices/token-prices';

describe('TokenPrice', () => {
  let coinSpy: jasmine.SpyObj<Coin>;
  let tokenPricesSpy: jasmine.SpyObj<TokenPrices>;

  beforeEach(() => {
    coinSpy = jasmine.createSpyObj('Coin', {}, { value: 'USDC' });
    tokenPricesSpy = jasmine.createSpyObj('TokenPrices', {
      value: Promise.resolve({
        USDC: 10,
      }),
    });
  });

  it('should create', () => {
    expect(new TokenPrice(tokenPricesSpy, coinSpy)).toBeTruthy();
  });

  it('should get value', async () => {
    expect(await new TokenPrice(tokenPricesSpy, coinSpy).value()).toEqual(10);
  });
});
