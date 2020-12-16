import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FundEditStopLossPage } from './fund-edit-stop-loss.page';
import { SharedFundsModule } from '../shared-funds/shared-funds.module';

const routes: Routes = [
  {
    path: '',
    component: FundEditStopLossPage
  }
];

@NgModule({
  imports: [
    SharedFundsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [FundEditStopLossPage]
})
export class FundEditStopLossPageModule {}
