import { Pipe, PipeTransform } from '@angular/core';
import { Currency } from '../../enums/currency.enum';

@Pipe({
  name: 'currencyText'
})
export class CurrencyTextPipe implements PipeTransform {
  transform(value: string): string {
    return value === Currency.BTC ? Currency.BTC : Currency.USDT;
  }
}
