import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FundBalancePage } from './fund-balance.page';
import { SharedFundsModule } from '../shared-funds/shared-funds.module';
import { FundBalanceChartComponent } from './components/fund-balance-chart/fund-balance-chart.component';
import { CurrencyEndBalancePipe } from './pipes/currency-end-balance/currency-end-balance.pipe';
import { FundBalanceDetailComponent } from './components/fund-balance-detail/fund-balance-detail.component';

const routes: Routes = [
  {
    path: '',
    component: FundBalancePage
  }
];

@NgModule({
  imports: [SharedFundsModule, RouterModule.forChild(routes)],
  declarations: [
    FundBalancePage,
    FundBalanceChartComponent,
    FundBalanceDetailComponent,
    CurrencyEndBalancePipe
  ]
})
export class FundBalancePageModule {}
