import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FundInvestmentPage } from './fund-investment.page';
import { SharedFundsModule } from '../shared-funds/shared-funds.module';
import { BeforeStepDataGuard } from '../shared-funds/guards/before-steps-data-guard/before-step-data.guard';

const routes: Routes = [
  {
    path: '',
    canActivate: [BeforeStepDataGuard],
    component: FundInvestmentPage,
  },
  {
    path: ':show',
    component: FundInvestmentPage,
  },
];

@NgModule({
  imports: [SharedFundsModule, RouterModule.forChild(routes)],
  declarations: [FundInvestmentPage],
})
export class FundInvestmentPageModule {}
