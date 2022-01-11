import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { AmountInputCardComponent } from './components/amount-input-card/amount-input-card.component';
import { ExpandableInvestmentInfoComponent } from './components/expandable-investment-info/expandable-investment-info.component';
@NgModule({
  declarations: [AmountInputCardComponent, ExpandableInvestmentInfoComponent],
  imports: [SharedModule],
  exports: [SharedModule, AmountInputCardComponent, ExpandableInvestmentInfoComponent],
})
export class SharedDefiInvestmentsModule {}
