import { FakeInvestedBalanceResponse } from './fake-invested-balance-response';
import { InvestedBalanceResponse } from '../invested-balance-response.interface';
import { rawInvestedBalanceResponse } from '../raw-invested-balance-response';

describe('FakeInvestedBalanceResponse', () => {
  let investedBalanceResponse: InvestedBalanceResponse;

  beforeEach(() => {
    investedBalanceResponse = new FakeInvestedBalanceResponse();
  });

  it('new', () => {
    expect(investedBalanceResponse).toBeTruthy();
  });

  it('balance', () => {
    expect(investedBalanceResponse.balance()).toEqual(2);
  });

  it('balanceUSD', () => {
    expect(investedBalanceResponse.balanceUSD()).toEqual(2.01022);
  });

  it('json', () => {
    expect(investedBalanceResponse.json()).toEqual(rawInvestedBalanceResponse);
  });
});
