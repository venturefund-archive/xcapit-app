import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
  name: 'comissionName'
})
export class CommissionNamePipe implements PipeTransform {
  constructor(private translate: TranslateService) {}
  transform(value: any): string {
    if (value.inversion_from && value.inversion_to) {
      return `${value.inversion_from} BTC ${ this.translate.instant('funds.commissions.to') } ${value.inversion_to} BTC`;
    } else if (value.inversion_from) {
      return `> ${value.inversion_from} BTC`;
    } else {
      return `< ${value.inversion_to} BTC`;
    }
  }
}
