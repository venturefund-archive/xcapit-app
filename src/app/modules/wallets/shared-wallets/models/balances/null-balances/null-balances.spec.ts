import { NullBalances } from './null-balances';
import { Coin } from '../../../interfaces/coin.interface';

describe('NullBalances', () => {
  let coinSpy: jasmine.SpyObj<Coin>;

  beforeEach(() => {
    coinSpy = jasmine.createSpyObj('Coin', {}, { value: 'MATIC' });
  });

  it('new', () => {
    expect(new NullBalances()).toBeTruthy();
  });

  it('value', async () => {
    expect(await new NullBalances().value()).toEqual([]);
  });

  it('valueOf', async () => {
    expect(await new NullBalances().valueOf(coinSpy)).toEqual({});
  });
});
