import { Balances } from '../balances.interface';
import { Coin } from '../../../interfaces/coin.interface';

export class FakeBalances implements Balances {
  constructor(private readonly valueReturn: any = {}, private readonly valueOfReturn: any = {}) {}

  public value(): Promise<any> {
    return Promise.resolve(this.valueReturn);
  }

  public valueOf(aCoin: Coin): Promise<any> {
    return Promise.resolve(this.valueOfReturn);
  }
}
