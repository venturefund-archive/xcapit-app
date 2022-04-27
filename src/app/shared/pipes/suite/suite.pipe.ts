import { Pipe, PipeTransform } from '@angular/core';
import { SUITE_NAMES } from '../../../modules/wallets/shared-wallets/constants/suites-names';

@Pipe({
  name: 'suite',
})
export class SuitePipe implements PipeTransform {
  transform(value: string): string {
    if (SUITE_NAMES.hasOwnProperty(value)) {
      return SUITE_NAMES[value];
    }

    return value;
  }
}
