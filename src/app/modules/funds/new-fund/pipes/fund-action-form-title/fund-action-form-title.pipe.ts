import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fundActionFormTitle'
})
export class FundActionFormTitlePipe implements PipeTransform {

  transform(value: string): string {
    return `funds.new_fund.header_${value}`;
  }

}
