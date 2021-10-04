import { Pipe, PipeTransform } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { Currency } from '../../enums/currency.enum';

interface CurrencyFormatInterface {
  currency: string;
  formatUSDT: string;
  formatBTC: string;
}

@Pipe({
  name: 'currencyFormat',
})
export class CurrencyFormatPipe implements PipeTransform {
  constructor(private decimalPipe: DecimalPipe) {}
  transform(value: number, args: CurrencyFormatInterface): string {
    const { currency, formatUSDT, formatBTC } = args;
    return `${this.decimalPipe.transform(value, currency === Currency.USDT ? formatUSDT : formatBTC)} ${currency}`;
  }
}
