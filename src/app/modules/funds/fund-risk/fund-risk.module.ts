import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


import { FundRiskPage } from './fund-risk.page';
import { SharedFundsModule } from '../shared-funds/shared-funds.module';

const routes: Routes = [
  {
    path: '',
    component: FundRiskPage
  }
];

@NgModule({
  imports: [
    SharedFundsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [FundRiskPage]
})
export class FundRiskPageModule {}
