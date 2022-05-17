import { NullPrices } from './null-prices';
import { Coin } from '../../../interfaces/coin.interface';

describe('NullPrices', () => {
  let coinSpy: jasmine.SpyObj<Coin>;
  beforeEach(() => {
    coinSpy = jasmine.createSpyObj('Coin', {}, { value: 'MATIC' });
  });

  it('new', () => {
    expect(new NullPrices()).toBeTruthy();
  });

  it('value', async () => {
    expect(await new NullPrices().value()).toEqual({});
  });

  it('valueOf', async () => {
    expect(await new NullPrices().valueOf(coinSpy)).toEqual({});
  });
});
