import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


import { FundInvestmentPage } from './fund-investment.page';
import { SharedFundsModule } from '../shared-funds/shared-funds.module';

const routes: Routes = [
  {
    path: '',
    component: FundInvestmentPage
  }
];

@NgModule({
  imports: [
    SharedFundsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [FundInvestmentPage]
})
export class FundInvestmentPageModule {}
