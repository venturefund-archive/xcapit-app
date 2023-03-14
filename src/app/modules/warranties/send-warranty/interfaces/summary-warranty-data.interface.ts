import { Coin } from "src/app/modules/wallets/shared-wallets/interfaces/coin.interface";

export interface SummaryWarrantyData {
  wallet?: string;
  currency?: string;
  status?: string;
  amount: number;
  coin?: Coin;
  user_dni: number;
  quoteAmount?: number;
  quoteAmountWithoutCost?: number;
  service_cost?: number;
  amountWithoutCost?: number;
  transaction_hash?: string,
}
