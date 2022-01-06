import { Injectable } from '@angular/core';
import { CacheService } from '../../../../../shared/services/cache/cache.service';

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
}
