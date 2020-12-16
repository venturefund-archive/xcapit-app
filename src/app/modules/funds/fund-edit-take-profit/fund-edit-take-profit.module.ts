import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FundEditTakeProfitPage } from './fund-edit-take-profit.page';
import { SharedFundsModule } from '../shared-funds/shared-funds.module';

const routes: Routes = [
  {
    path: '',
    component: FundEditTakeProfitPage
  }
];

@NgModule({
  imports: [
    SharedFundsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [FundEditTakeProfitPage]
})
export class FundEditTakeProfitPageModule {}
