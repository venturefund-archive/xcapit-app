import { Prices } from '../prices.interface';
import { Coin } from '../../../interfaces/coin.interface';

export class NullPrices implements Prices {
  constructor() {}

  public value(): Promise<any> {
    return Promise.resolve({});
  }

  public valueOf(coin: Coin): Promise<any> {
    return Promise.resolve({});
  }
}
