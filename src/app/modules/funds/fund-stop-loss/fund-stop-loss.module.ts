import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FundStopLossPage } from './fund-stop-loss.page';
import { SharedFundsModule } from '../shared-funds/shared-funds.module';

const routes: Routes = [
  {
    path: '',
    component: FundStopLossPage
  }
];

@NgModule({
  imports: [
    SharedFundsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [FundStopLossPage]
})
export class FundStopLossPageModule {}
