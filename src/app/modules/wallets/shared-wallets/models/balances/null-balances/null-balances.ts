import { Balances } from '../balances.interface';
import { Coin } from '../../../interfaces/coin.interface';

export class NullBalances implements Balances {
  constructor() {}

  public value(): Promise<any> {
    return Promise.resolve([]);
  }

  public valueOf(aCoin: Coin): Promise<any> {
    return Promise.resolve({});
  }
}
