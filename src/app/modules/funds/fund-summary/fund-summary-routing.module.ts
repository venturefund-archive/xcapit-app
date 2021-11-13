import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FundSummaryPage } from './fund-summary.page';

const routes: Routes = [
  {
    path: '',
    component: FundSummaryPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FundSummaryPageRoutingModule {}
