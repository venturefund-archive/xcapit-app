import { Pipe, PipeTransform } from '@angular/core';
import { Currency } from '../../../shared-funds/enums/currency.enum';

/**
 * Pipe muy específica, acepta fundBalance para determinar
 * que balance debe mostrar según la currency del fondo.
 * fundBalance debe tener la siguiente interface:
 * {
 *   fund: { currency: string, ... },
 *   balance: { balance_fin_btc: number, balance_fin_usd, ...}
 * }
 */
@Pipe({
  name: 'currencyEndBalance'
})
export class CurrencyEndBalancePipe implements PipeTransform {
  transform(value: {
    fund: { currency: string };
    balance: {
      balance_fin_btc: number;
      balance_fin_usd: number;
      to_ca?: { balance_fin: number };
    };
  }): number {
    if (value.balance.to_ca) {
      return value.balance.to_ca.balance_fin;
    } else {
      return value.fund.currency === Currency.BTC
        ? value.balance.balance_fin_btc
        : value.balance.balance_fin_usd;
    }
  }
}
