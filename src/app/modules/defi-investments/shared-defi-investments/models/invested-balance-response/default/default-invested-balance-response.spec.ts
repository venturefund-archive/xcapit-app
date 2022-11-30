import { rawInvestedBalanceResponse } from '../raw-invested-balance-response';
import { DefaultInvestedBalanceResponse } from './default-invested-balance-response';
import { InvestedBalanceResponse } from '../invested-balance-response.interface';
import { rawMATICData } from '../../../../../swaps/shared-swaps/models/fixtures/raw-tokens-data';
import { DefaultToken } from '../../../../../swaps/shared-swaps/models/token/token';

describe('DefaultInvestedBalanceResponse', () => {
  let investedBalanceResponse: InvestedBalanceResponse;

  beforeEach(() => {
    investedBalanceResponse = new DefaultInvestedBalanceResponse(
      rawInvestedBalanceResponse,
      new DefaultToken(rawMATICData)
    );
  });

  it('new', () => {
    expect(investedBalanceResponse).toBeTruthy();
  });

  it('balance', () => {
    expect(investedBalanceResponse.balance()).toEqual(9.816e-15);
  });

  it('balanceUSD', () => {
    expect(investedBalanceResponse.balanceUSD().toString()).toEqual('2.010222515191891');
  });

  it('json', () => {
    expect(investedBalanceResponse.json()).toEqual(rawInvestedBalanceResponse);
  });
});
