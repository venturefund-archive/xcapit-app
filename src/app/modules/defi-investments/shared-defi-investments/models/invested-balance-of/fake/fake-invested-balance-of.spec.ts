import { FakeInvestedBalanceOf } from './fake-invested-balance-of';

describe('FakeInvestedBalanceOf', () => {
  it('new', () => {
    expect(new FakeInvestedBalanceOf(Promise.resolve(5))).toBeTruthy();
  });

  it('value', async () => {
    expect(await new FakeInvestedBalanceOf(Promise.resolve(5)).value()).toEqual(5);
  });
});
