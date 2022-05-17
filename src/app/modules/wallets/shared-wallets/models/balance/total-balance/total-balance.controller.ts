import { Injectable } from '@angular/core';
import { TotalBalance } from './total-balance';
import { Balances } from '../../balances/balances.interface';
import { Prices } from '../../prices/prices.interface';
import { Balance } from '../balance.interface';

@Injectable({ providedIn: 'root' })
export class TotalBalanceController {
  public new(prices: Prices, balances: Balances, baseBalance: Balance): TotalBalance {
    return new TotalBalance(prices, balances, baseBalance);
  }
}
