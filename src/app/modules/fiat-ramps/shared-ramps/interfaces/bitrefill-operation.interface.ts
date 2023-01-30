import { Coin } from "src/app/modules/wallets/shared-wallets/interfaces/coin.interface";

export interface BitrefillOperation {
  address: string;
  token: Coin;
  amount: number;
  weiAmount: number;
}
