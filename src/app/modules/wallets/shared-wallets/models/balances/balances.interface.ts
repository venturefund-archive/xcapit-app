import { Coin } from '../../interfaces/coin.interface';

export interface Balances {
  value: () => Promise<any>;
  valueOf: (aCoin: Coin) => Promise<any>;
}
