import { Coin } from '../../interfaces/coin.interface';
import { FakeHttpClient } from '../../../../../../testing/fakes/fake-http.spec';
import { TokenPrices } from './token-prices';

fdescribe('TokenPrices', () => {
  let usdcSpy: jasmine.SpyObj<Coin>;
  let maticSpy: jasmine.SpyObj<Coin>;
  let tokenPrices: TokenPrices;

  beforeEach(() => {
    usdcSpy = jasmine.createSpyObj('USDC', {}, { value: 'USDC' });
    maticSpy = jasmine.createSpyObj('MATIC', {}, { value: 'MATIC' });
    tokenPrices = new TokenPrices(
      [usdcSpy, maticSpy],
      new FakeHttpClient({}, { prices: { USDC: 1, MATIC: 2 } }),
      'https://test.com/'
    );
  });

  it('should create', () => {
    expect(tokenPrices).toBeTruthy();
  });

  it('should create with default url', () => {
    expect(new TokenPrices([usdcSpy, maticSpy], new FakeHttpClient({}, {}))).toBeTruthy();
  });

  it('should get value', async () => {
    expect(await tokenPrices.value()).toEqual({ USDC: 1, MATIC: 2 });
  });

  it('should get cached value', async () => {
    expect(await tokenPrices.value()).toEqual({ USDC: 1, MATIC: 2 });
    expect(await tokenPrices.value()).toEqual({ USDC: 1, MATIC: 2 });
  });

  it('should get value of a coin', async () => {
    expect(await tokenPrices.valueOf(maticSpy)).toEqual(2);
  });
});
