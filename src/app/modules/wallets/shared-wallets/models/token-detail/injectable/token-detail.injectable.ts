import { Injectable } from '@angular/core';
import { Token } from 'src/app/modules/swaps/shared-swaps/models/token/token';
import { BalanceCacheService } from '../../../services/balance-cache/balance-cache.service';
import { Balances } from '../../balances/balances.interface';
import { TokenPrices } from '../../prices/token-prices/token-prices';
import { TokenDetail } from '../token-detail';

@Injectable({ providedIn: 'root' })
export class TokenDetailInjectable {
  constructor(private balanceCacheService: BalanceCacheService) {}

  create(
    _balances: Balances,
    _prices: TokenPrices,
    _token: Token,
    _balanceCacheService: BalanceCacheService = this.balanceCacheService
  ): TokenDetail {
    return new TokenDetail(_balances, _prices, _token, _balanceCacheService);
  }
}
