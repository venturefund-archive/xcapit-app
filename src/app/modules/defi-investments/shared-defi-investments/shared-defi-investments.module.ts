import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { AmountInputCardComponent } from './components/amount-input-card/amount-input-card.component';
import { ComingSoonInvestmentsComponent } from './components/coming-soon-investments/coming-soon-investments.component';
import { DefiInvestmentProductComponent } from './components/defi-investment-product/defi-investment-product.component';
import { ExpandableInvestmentInfoComponent } from './components/expandable-investment-info/expandable-investment-info.component';
@NgModule({
  declarations: [
    AmountInputCardComponent,
    ExpandableInvestmentInfoComponent,
    DefiInvestmentProductComponent,
    ComingSoonInvestmentsComponent,
  ],
  imports: [SharedModule],
  exports: [
    SharedModule,
    AmountInputCardComponent,
    ExpandableInvestmentInfoComponent,
    DefiInvestmentProductComponent,
    ComingSoonInvestmentsComponent,
  ],
})
export class SharedDefiInvestmentsModule {}
