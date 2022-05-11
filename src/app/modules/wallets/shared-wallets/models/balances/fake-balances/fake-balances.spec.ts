import { FakeBalances } from './fake-balances';
import { Coin } from '../../../interfaces/coin.interface';

describe('FakeBalances', () => {
  let coinSpy: jasmine.SpyObj<Coin>;

  beforeEach(() => {
    coinSpy = jasmine.createSpyObj('Coin', {}, { value: 'MATIC' });
  });

  it('new', () => {
    expect(new FakeBalances({})).toBeTruthy();
  });

  it('value', async () => {
    expect(await new FakeBalances({}).value()).toEqual({});
  });

  it('valueOf', async () => {
    expect(await new FakeBalances({}, {}).valueOf(coinSpy)).toEqual({});
  });
});
