import { RawInvestedBalanceResponse } from '../raw-invested-balance-response';
import { InvestedBalanceResponse } from '../invested-balance-response.interface';

export class NullInvestedBalanceResponse implements InvestedBalanceResponse {
  constructor() {}

  public balance(): number {
    return 0;
  }

  public balanceUSD(): number {
    return 0;
  }

  public json(): RawInvestedBalanceResponse {
    return { balance: '0', balanceUSD: '0', amount: '0', type: '', timestamp: '' };
  }
}
