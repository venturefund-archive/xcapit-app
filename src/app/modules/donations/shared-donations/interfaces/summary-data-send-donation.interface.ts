import { Amount } from 'src/app/modules/defi-investments/shared-defi-investments/types/amount.type';
import { Coin } from '../../../wallets/shared-wallets/interfaces/coin.interface';

export interface SummaryDataSendDonation {
  address: string;
  amount: number;
  referenceAmount: string;
  currency: Coin;
  network: string;
  balanceNativeToken?: number;
  balance?: number;
  fee?: string;
  referenceFee?: number;
}