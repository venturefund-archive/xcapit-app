import { Coin } from '../../../interfaces/coin.interface';
import { TokenPrices } from '../token-prices/token-prices';

export class TokenPrice {
  constructor(private readonly _prices: TokenPrices, private readonly _coin: Coin) {}

  public value(): Promise<number> {
    return this._prices.value().then((prices) => prices[this._coin.value]);
  }
}
