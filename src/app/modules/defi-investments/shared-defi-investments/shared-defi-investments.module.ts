import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { AmountInputCardComponent } from './components/amount-input-card/amount-input-card.component';
import { ComingSoonInvestmentsComponent } from './components/coming-soon-investments/coming-soon-investments.component';
import { DefiInvestmentProductComponent } from './components/defi-investment-product/defi-investment-product.component';
import { InvestmentBalanceItemComponent } from './components/investment-balance-item/investment-balance-item.component';
import { ExpandableInvestmentInfoComponent } from './components/expandable-investment-info/expandable-investment-info.component';
import { DefiInvestmentWithdrawComponent } from './components/defi-investment-withdraw/defi-investment-withdraw.component';
import { DefiInvestmentProductSkeletonComponent } from './components/defi-investment-product/defi-investment-product-skeleton/defi-investment-product-skeleton.component';
import { ChooseInvestorProfileSkeletonComponent } from './components/choose-investor-profile-card/choose-investor-profile-card-skeleton/choose-investor-profile-skeleton.component';
import { ChooseInvestorProfileCardComponent } from './components/choose-investor-profile-card/choose-investor-profile-card.component';
import { FilterTabComponent } from './components/filter-tab/filter-tab.component';
@NgModule({
  declarations: [
    AmountInputCardComponent,
    ExpandableInvestmentInfoComponent,
    DefiInvestmentProductComponent,
    ChooseInvestorProfileSkeletonComponent,
    DefiInvestmentProductSkeletonComponent,
    InvestmentBalanceItemComponent,
    ComingSoonInvestmentsComponent,
    DefiInvestmentWithdrawComponent,
    ChooseInvestorProfileCardComponent,
  ],
  imports: [SharedModule],
  exports: [
    SharedModule,
    AmountInputCardComponent,
    ExpandableInvestmentInfoComponent,
    ChooseInvestorProfileSkeletonComponent,
    DefiInvestmentProductComponent,
    DefiInvestmentProductSkeletonComponent,
    InvestmentBalanceItemComponent,
    ComingSoonInvestmentsComponent,
    DefiInvestmentWithdrawComponent,
    ChooseInvestorProfileCardComponent,
  ],
})
export class SharedDefiInvestmentsModule {}
