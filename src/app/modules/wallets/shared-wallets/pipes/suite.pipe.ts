import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'suite',
})
export class SuitePipe implements PipeTransform {
  transform(value: string): string {
    switch (value) {
      case 'ERC20':
        return 'Ethereum';
      case 'BSC_BEP20':
        return 'Binance Smart Chain';
      case 'MATIC':
        return 'Polygon';
      default:
        return value;
    }
  }
}
