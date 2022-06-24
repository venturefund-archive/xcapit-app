import { Pipe, PipeTransform } from '@angular/core';
import { FormattedAmount } from '../../models/formatted-amount/formatted-amount';

@Pipe({
  name: 'formattedAmount',
})
export class FormattedAmountPipe implements PipeTransform {
  transform(value: number, totalDigits = 14, maxDecimals = 8): string {
    return value !== undefined ? new FormattedAmount(value, totalDigits, maxDecimals).asString() : undefined;
  }
}
