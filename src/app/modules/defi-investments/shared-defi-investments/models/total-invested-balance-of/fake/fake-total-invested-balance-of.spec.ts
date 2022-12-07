import { FakeTotalInvestedBalanceOf } from './fake-total-invested-balance-of';
import { TotalInvestedBalanceOf } from '../total-invested-balance-of.interface';

describe('FakeTotalInvestedBalanceOf', () => {
  let totalInvestedBalance: TotalInvestedBalanceOf;

  beforeEach(() => {
    totalInvestedBalance = new FakeTotalInvestedBalanceOf(Promise.resolve(5));
  });

  it('new', () => {
    expect(totalInvestedBalance).toBeTruthy();
  });

  it('new with defaults', () => {
    expect(new FakeTotalInvestedBalanceOf()).toBeTruthy();
  });

  it('value', async () => {
    expect(await totalInvestedBalance.value()).toEqual(5);
  });
});
