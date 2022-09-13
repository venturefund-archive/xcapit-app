import { TokenPrices } from '../prices/token-prices/token-prices';
import { BalanceCacheService } from '../../services/balance-cache/balance-cache.service';
import { Balances } from '../balances/balances.interface';
import { Token } from '../../../../swaps/shared-swaps/models/token/token';
import { RawToken } from '../../../../swaps/shared-swaps/models/token-repo/token-repo';
import { Coin } from '../../interfaces/coin.interface';

export class TokenDetail {
  price = 0;
  balance = 0;
  quoteSymbol = 'USD';

  constructor(
    private readonly _balances: Balances,
    private readonly _prices: TokenPrices,
    private readonly _token: Token,
    private readonly balanceCacheService: BalanceCacheService
  ) {}

  public async cached(): Promise<void> {
    const cachedCoin = await this.balanceCacheService.coin(this._token.json());
    this.price = cachedCoin ? cachedCoin.price : 0;
    this.balance = cachedCoin ? cachedCoin.balance : 0;
  }

  public async cache(): Promise<void> {
    await this.balanceCacheService.updateCoin(this._token.json(), { price: this.price, balance: this.balance });
  }

  public async fetch(): Promise<void> {
    this.price = await this._prices.valueOf(this._token.json());
    this.balance = (await this._balances.valueOf(this._token.json())).balance;
  }

  public get token(): RawToken {
    return this._token.json();
  }
}
