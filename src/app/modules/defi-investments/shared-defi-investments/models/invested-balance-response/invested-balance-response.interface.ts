import { RawInvestedBalanceResponse } from './raw-invested-balance-response';

export interface InvestedBalanceResponse {
  balanceUSD: () => number;
  balance: () => number;
  json: () => RawInvestedBalanceResponse;
}
