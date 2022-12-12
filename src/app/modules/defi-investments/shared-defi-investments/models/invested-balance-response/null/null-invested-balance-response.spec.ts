import { NullInvestedBalanceResponse } from './null-invested-balance-response';
import { InvestedBalanceResponse } from '../invested-balance-response.interface';

describe('NullInvestedBalanceResponse', () => {
  let investedBalanceResponse: InvestedBalanceResponse;

  beforeEach(() => {
    investedBalanceResponse = new NullInvestedBalanceResponse();
  });

  it('new', () => {
    expect(investedBalanceResponse).toBeTruthy();
  });

  it('balance', () => {
    expect(investedBalanceResponse.balance()).toEqual(0);
  });

  it('balanceUSD', () => {
    expect(investedBalanceResponse.balanceUSD()).toEqual(0);
  });

  it('json', () => {
    expect(investedBalanceResponse.json()).toEqual({
      balance: '0',
      balanceUSD: '0',
      amount: '0',
      type: '',
      timestamp: '',
    });
  });
})
