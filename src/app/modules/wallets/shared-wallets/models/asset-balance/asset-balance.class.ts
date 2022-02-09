import { BalanceCacheService, CachedCoin } from './../../services/balance-cache/balance-cache.service';
import { WalletBalanceService } from './../../services/wallet-balance/wallet-balance.service';
import { Coin } from '../../interfaces/coin.interface';
import { Subject } from 'rxjs';

export class AssetBalanceModel {
  coin: Coin;
  icon: string;
  symbol: string;
  name: string;
  amount: number;
  price: number;
  quoteSymbol: string;
  private pricePromise: Promise<number>;
  private balancePromise: Promise<number>;
  quoteBalance: Subject<number>;

  constructor(
    aCoin: Coin,
    private walletBalance: WalletBalanceService,
    private balanceCacheService: BalanceCacheService
  ) {
    this.coin = aCoin;
    this.icon = aCoin.logoRoute;
    this.symbol = aCoin.value;
    this.name = aCoin.name;
    this.amount = 0;
    this.price = 0;
    this.quoteSymbol = 'USD';
    this.quoteBalance = new Subject<number>();
  }

  getPrice(): Promise<number> {
    this.pricePromise = this.walletBalance.priceOf(this.coin).then((price) => {
      this.price = price;
      this.balanceCacheService.updateCoin(this.coin, { price });
      this.quote();
      return price;
    });
    return this.pricePromise;
  }

  balance(): Promise<number> {
    this.balancePromise = this.walletBalance.balanceOf(this.coin).then((balance) => {
      this.amount = balance;
      this.balanceCacheService.updateCoin(this.coin, { balance });
      this.quote();
      return balance;
    });
    return this.balancePromise;
  }

  quote() {
    if (this.balancePromise && this.pricePromise) {
      Promise.all([this.balancePromise, this.pricePromise]).then(([balance, price]) => {
        this.quoteBalance.next(balance * price);
        this.quoteBalance.complete();
      });
    }
  }

  cachedBalance(): Promise<CachedCoin> {
    return this.balanceCacheService.coin(this.coin).then((cachedCoin: CachedCoin) => {
      if (cachedCoin) {
        this.amount = cachedCoin.balance;
        this.price = cachedCoin.price;
      }
      return cachedCoin;
    });
  }
}
