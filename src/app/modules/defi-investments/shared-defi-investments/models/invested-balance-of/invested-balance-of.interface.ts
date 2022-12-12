import { InvestedBalanceResponse } from '../invested-balance-response/invested-balance-response.interface';

export interface InvestedBalanceOf {
  value: () => Promise<InvestedBalanceResponse>;
  cached: () => Promise<InvestedBalanceResponse>;
}
