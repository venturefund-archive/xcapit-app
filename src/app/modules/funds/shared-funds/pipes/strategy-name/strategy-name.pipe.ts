import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
  name: 'strategyName',
})
export class StrategyNamePipe implements PipeTransform {
  constructor(private translate: TranslateService) {}
  transform(profile: string): string {
    return this.translate.instant(`funds.fund_investment.card.profiles.${profile}.title`);
  }
}
