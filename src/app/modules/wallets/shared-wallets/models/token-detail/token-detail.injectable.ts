import { Injectable } from '@angular/core';
import { TokenDetail } from './token-detail';
import { BalanceCacheService } from '../../services/balance-cache/balance-cache.service';
import { TokenPrices } from '../prices/token-prices/token-prices';
import { Balances } from '../balances/balances.interface';
import { Token } from '../../../../swaps/shared-swaps/models/token/token';

@Injectable({ providedIn: 'root' })
export class TokenDetailInjectable {
  public create(
    _balances: Balances,
    _prices: TokenPrices,
    token: Token,
    balanceCacheService: BalanceCacheService
  ): TokenDetail {
    return new TokenDetail(_balances, _prices, token, balanceCacheService);
  }
}
