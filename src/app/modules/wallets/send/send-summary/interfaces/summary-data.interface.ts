import { Coin } from '../../../shared-wallets/interfaces/coin.interface';

export interface SummaryData {
  address: string;
  amount: number;
  referenceAmount: string;
  currency: Coin;
  network: string;
  balanceNativeToken?: number;
  balance?: number;
  fee?: string;
  referenceFee?: string;
}
