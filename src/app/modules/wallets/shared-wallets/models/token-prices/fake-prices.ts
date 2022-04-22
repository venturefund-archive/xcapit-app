import { Prices } from './prices.interface';
import { Coin } from '../../interfaces/coin.interface';

export class FakePrices implements Prices {
  constructor(private readonly valueReturn: any = {}) {}

  public value(): Promise<any> {
    return Promise.resolve(this.valueReturn);
  }

  public valueOf(coin: Coin): Promise<any> {
    return Promise.resolve(this.valueReturn[coin.value]);
  }
}
