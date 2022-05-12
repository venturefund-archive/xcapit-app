import { Pipe, PipeTransform } from '@angular/core';
import { FormattedAmount } from '../../models/formatted-amount/formatted-amount';

@Pipe({
  name: 'formattedAmount',
})
export class FormattedAmountPipe implements PipeTransform {
  transform(value: number, totalDigits = 14, maxDecimals = 8): number {
    return value ? new FormattedAmount(value, totalDigits, maxDecimals).value() : undefined;
  }
}
