import { Coin } from "src/app/modules/wallets/shared-wallets/interfaces/coin.interface";

export interface SummaryWarrantyData {
  amount: number;
  coin: Coin;
  dni: number;
  quoteAmount: number;
  quoteAmountWithoutCost?: number;
  serviceCost?: number;
  amountWithoutCost?: number;
}
