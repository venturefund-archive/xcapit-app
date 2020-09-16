import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FundSuccessPage } from './fund-success.page';
import { SharedFundsModule } from '../shared-funds/shared-funds.module';

const routes: Routes = [
  {
    path: '',
    component: FundSuccessPage
  },
  {
    path: ':isRenew',
    component: FundSuccessPage
  }
];

@NgModule({
  imports: [SharedFundsModule, RouterModule.forChild(routes)],
  declarations: [FundSuccessPage]
})
export class FundSuccessPageModule {}
