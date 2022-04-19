import { Coin } from '../../interfaces/coin.interface';
import { CovalentBalances } from '../covalent-balances/covalent-balances';
import { TokenPrices } from '../token-prices/token-prices';

export class TokenDetail2 {
  price: number = 0;
  balance: number = 0;
  quoteSymbol = 'USD';

  constructor(
    private readonly _balances: CovalentBalances,
    private readonly _prices: TokenPrices,
    public readonly coin: Coin
  ) {}

  public async fetch(): Promise<any> {
    this.price = await this._prices.valueOf(this.coin);
    this.balance = (await this._balances.valueOf(this.coin)).balance;
  }
}
