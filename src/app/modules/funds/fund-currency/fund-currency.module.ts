import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FundCurrencyPage } from './fund-currency.page';
import { SharedFundsModule } from '../shared-funds/shared-funds.module';

const routes: Routes = [
  {
    path: '',
    component: FundCurrencyPage
  }
];

@NgModule({
  imports: [
    SharedFundsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [FundCurrencyPage]
})
export class FundCurrencyPageModule {}
