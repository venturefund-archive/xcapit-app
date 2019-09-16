import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FundSummaryPage } from './fund-summary.page';
import { SharedFundsModule } from '../shared-funds/shared-funds.module';
import { PercentageDisplayComponent } from './components/percentage-display/percentage-display.component';

const routes: Routes = [
  {
    path: '',
    component: FundSummaryPage
  }
];

@NgModule({
  imports: [
    SharedFundsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [FundSummaryPage, PercentageDisplayComponent]
})
export class FundSummaryPageModule {}
