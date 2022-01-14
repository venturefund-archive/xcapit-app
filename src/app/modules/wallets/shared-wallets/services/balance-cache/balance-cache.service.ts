import { Injectable } from '@angular/core';
import { CacheService } from '../../../../../shared/services/cache/cache.service';
import { Coin } from '../../interfaces/coin.interface';
export type CachedCoin = { balance: number; price: number; expiration_date: number };
export type BalanceOrPrice = { balance?: number; price?: number };

@Injectable({
  providedIn: 'root',
})
export class BalanceCacheService {
  PREFIX = 'balance_';

  constructor(private cacheService: CacheService) {}

  private addPrefix(key: string): string {
    return `${this.PREFIX}${key}`;
  }

  total(): Promise<number | undefined> {
    return this.cacheService.get(this.addPrefix('total')).then((res) => res && res.value);
  }

  updateTotal(value: number): Promise<void> {
    return this.cacheService.update(this.addPrefix('total'), { value });
  }

  coin(aCoin: Coin): Promise<CachedCoin> {
    return this.cacheService.get(this.addPrefix(`${aCoin.network}_${aCoin.value}`));
  }

  updateCoin(aCoin: Coin, value: BalanceOrPrice): Promise<void> {
    return this.coin(aCoin).then((cachedBalance: CachedCoin) =>
      this.cacheService.update(this.addPrefix(`${aCoin.network}_${aCoin.value}`), {
        balance: value.balance ?? (cachedBalance && cachedBalance.balance),
        price: value.price ?? (cachedBalance && cachedBalance.price),
      })
    );
  }
}
