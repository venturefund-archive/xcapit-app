import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fundActionFormTextButton'
})
export class FundActionFormTextButtonPipe implements PipeTransform {

  transform(value: any): string {
    return `funds.new_fund.submit_button_${value}`;
  }

}
