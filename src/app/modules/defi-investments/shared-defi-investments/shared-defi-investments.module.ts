import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { AmountInputCardComponent } from './components/amount-input-card/amount-input-card.component';
import { ComingSoonInvestmentsComponent } from './components/coming-soon-investments/coming-soon-investments.component';
import { DefiInvestmentProductComponent } from './components/defi-investment-product/defi-investment-product.component';
import { InvestmentBalanceItemComponent } from './components/investment-balance-item/investment-balance-item.component';
import { ExpandableInvestmentInfoComponent } from './components/expandable-investment-info/expandable-investment-info.component';
import { DefiInvestmentWithdrawComponent } from './components/defi-investment-withdraw/defi-investment-withdraw.component';
@NgModule({
  declarations: [
    AmountInputCardComponent,
    ExpandableInvestmentInfoComponent,
    DefiInvestmentProductComponent,
    InvestmentBalanceItemComponent,
    ComingSoonInvestmentsComponent,
    DefiInvestmentWithdrawComponent,
  ],
  imports: [SharedModule],
  exports: [
    SharedModule,
    AmountInputCardComponent,
    ExpandableInvestmentInfoComponent,
    DefiInvestmentProductComponent,
    InvestmentBalanceItemComponent,
    ComingSoonInvestmentsComponent,
    DefiInvestmentWithdrawComponent,
  ],
})
export class SharedDefiInvestmentsModule {}
