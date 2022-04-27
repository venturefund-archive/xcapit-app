import { Coin } from '../../interfaces/coin.interface';

export interface Prices {
  value: () => Promise<any>;
  valueOf: (aCoin: Coin) => Promise<any>;
}
