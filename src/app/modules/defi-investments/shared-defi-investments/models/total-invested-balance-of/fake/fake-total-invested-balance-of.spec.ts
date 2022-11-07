import { FakeTotalInvestedBalanceOf } from './fake-total-invested-balance-of';

describe('FakeTotalInvestedBalanceOf', () => {
  it('new', () => {
    expect(new FakeTotalInvestedBalanceOf(Promise.resolve(5))).toBeTruthy();
  });

  it('value', async () => {
    expect(await new FakeTotalInvestedBalanceOf(Promise.resolve(5)).value()).toEqual(5);
  });
});
