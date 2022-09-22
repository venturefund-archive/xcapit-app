import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { ComingSoonInvestmentsComponent } from './components/coming-soon-investments/coming-soon-investments.component';
import { DefiInvestmentProductComponent } from './components/defi-investment-product/defi-investment-product.component';
import { InvestmentBalanceItemComponent } from './components/investment-balance-item/investment-balance-item.component';
import { ExpandableInvestmentInfoComponent } from './components/expandable-investment-info/expandable-investment-info.component';
import { DefiInvestmentWithdrawComponent } from './components/defi-investment-withdraw/defi-investment-withdraw.component';
import { DefiInvestmentProductSkeletonComponent } from './components/defi-investment-product/defi-investment-product-skeleton/defi-investment-product-skeleton.component';
import { ChooseInvestorProfileSkeletonComponent } from './components/choose-investor-profile-card/choose-investor-profile-card-skeleton/choose-investor-profile-skeleton.component';
import { ChooseInvestorProfileCardComponent } from './components/choose-investor-profile-card/choose-investor-profile-card.component';
import { WithdrawInfoModalComponent } from './components/withdraw-info-modal/withdraw-info-modal.component';
import { InvestmentHistoryComponent } from './components/investment-history/investment-history.component';
import { ItemInvestmentHistoryComponent } from './components/item-investment-history/item-investment-history.component';
import { CumulativeYieldsComponent } from './components/cumulative-yields/cumulative-yields.component';
@NgModule({
  declarations: [
    ExpandableInvestmentInfoComponent,
    DefiInvestmentProductComponent,
    ChooseInvestorProfileSkeletonComponent,
    DefiInvestmentProductSkeletonComponent,
    InvestmentBalanceItemComponent,
    ComingSoonInvestmentsComponent,
    DefiInvestmentWithdrawComponent,
    ChooseInvestorProfileCardComponent,
    WithdrawInfoModalComponent,
    InvestmentHistoryComponent,
    ItemInvestmentHistoryComponent,
    CumulativeYieldsComponent,
  ],
  imports: [SharedModule],
  exports: [
    SharedModule,
    ExpandableInvestmentInfoComponent,
    ChooseInvestorProfileSkeletonComponent,
    DefiInvestmentProductComponent,
    DefiInvestmentProductSkeletonComponent,
    InvestmentBalanceItemComponent,
    ComingSoonInvestmentsComponent,
    DefiInvestmentWithdrawComponent,
    ChooseInvestorProfileCardComponent,
    WithdrawInfoModalComponent,
    InvestmentHistoryComponent,
    ItemInvestmentHistoryComponent,
    CumulativeYieldsComponent,
  ],
})
export class SharedDefiInvestmentsModule {}
