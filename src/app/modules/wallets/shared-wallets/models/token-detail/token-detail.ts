import { Coin } from '../../interfaces/coin.interface';
import { CovalentBalances } from '../balances/covalent-balances/covalent-balances';
import { TokenPrices } from '../prices/token-prices/token-prices';
import { BalanceCacheService } from '../../services/balance-cache/balance-cache.service';

export class TokenDetail {
  price: number = 0;
  balance: number = 0;
  quoteSymbol = 'USD';

  constructor(
    private readonly _balances: CovalentBalances,
    private readonly _prices: TokenPrices,
    public readonly coin: Coin,
    private readonly balanceCacheService: BalanceCacheService
  ) {}

  public async cached(): Promise<void> {
    const cachedCoin = await this.balanceCacheService.coin(this.coin);
    this.price = cachedCoin ? cachedCoin.price : 0;
    this.balance = cachedCoin ? cachedCoin.balance : 0;
  }

  public async cache(): Promise<void> {
    await this.balanceCacheService.updateCoin(this.coin, { price: this.price, balance: this.balance });
  }

  public async fetch(): Promise<void> {
    this.price = await this._prices.valueOf(this.coin);
    this.balance = (await this._balances.valueOf(this.coin)).balance;
  }
}
