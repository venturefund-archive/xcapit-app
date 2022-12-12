import { FakeInvestedBalanceOf } from './fake-invested-balance-of';
import { FakeInvestedBalanceResponse } from '../../invested-balance-response/fake/fake-invested-balance-response';

describe('FakeInvestedBalanceOf', () => {
  let fakeInvestedBalanceOf: FakeInvestedBalanceOf;

  beforeEach(() => {
    fakeInvestedBalanceOf = new FakeInvestedBalanceOf(Promise.resolve(new FakeInvestedBalanceResponse()));
  });

  it('new', () => {
    expect(fakeInvestedBalanceOf).toBeTruthy();
  });

  it('value', async () => {
    expect(await fakeInvestedBalanceOf.value()).toEqual(new FakeInvestedBalanceResponse());
  });

  it('cached', async () => {
    expect((await new FakeInvestedBalanceOf().cached()).balanceUSD()).toEqual(2);
  });


});
