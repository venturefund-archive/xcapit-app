import { Coin } from '../../../shared-wallets/interfaces/coin.interface';

export interface SummaryData {
  address: string;
  amount: number;
  referenceAmount: number;
  currency: Coin;
  network: string;
  balanceNativeToken?: number;
}
