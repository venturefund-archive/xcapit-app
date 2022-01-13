import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { AmountInputCardComponent } from './components/amount-input-card/amount-input-card.component';
import { DefiInvestmentProductComponent } from './components/defi-investment-product/defi-investment-product.component';
import { ExpandableInvestmentInfoComponent } from './components/expandable-investment-info/expandable-investment-info.component';
@NgModule({
  declarations: [AmountInputCardComponent, ExpandableInvestmentInfoComponent, DefiInvestmentProductComponent],
  imports: [SharedModule],
  exports: [SharedModule, AmountInputCardComponent, ExpandableInvestmentInfoComponent, DefiInvestmentProductComponent],
})
export class SharedDefiInvestmentsModule {}
