import { Injectable } from '@angular/core';
import { TokenDetail } from './token-detail';
import { CovalentBalances } from '../balances/covalent-balances/covalent-balances';
import { BalanceCacheService } from '../../services/balance-cache/balance-cache.service';
import { TokenPrices } from '../prices/token-prices/token-prices';
import { Coin } from '../../interfaces/coin.interface';

@Injectable({ providedIn: 'root' })
export class TokenDetailController {
  public new(
    _balances: CovalentBalances,
    _prices: TokenPrices,
    coin: Coin,
    balanceCacheService: BalanceCacheService
  ): TokenDetail {
    return new TokenDetail(_balances, _prices, coin, balanceCacheService);
  }
}