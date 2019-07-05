import { Pipe, PipeTransform } from '@angular/core';
import { Currency } from '../../enums/currency.enum';

/**
 * Pipe muy específica, acepta fundStatus para determinar
 * que porcentaje debe mostrar según la currency del fondo.
 * fundStatus debe tener la siguiente interface:
 * {
 *   fund: { currency: string, ... },
 *   status: { porcentaje_btc: string, porcentaje_usd, ...}
 * }
 */
@Pipe({
  name: 'currencyPercentage'
})
export class CurrencyPercentagePipe implements PipeTransform {
  transform(value: {
    fund: { currency: string },
    status: { porcentaje_btc: number, porcentaje_usd: number }
  }): number {
    return value.fund.currency === Currency.BTC
      ? value.status.porcentaje_btc
      : value.status.porcentaje_usd;
  }
}
