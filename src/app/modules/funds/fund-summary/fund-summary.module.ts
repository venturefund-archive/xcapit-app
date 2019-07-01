import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FundSummaryPage } from './fund-summary.page';
import { SharedModule } from 'src/app/shared/shared.module';

const routes: Routes = [
  {
    path: ':fundName',
    component: FundSummaryPage
  }
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [FundSummaryPage]
})
export class FundSummaryPageModule {}
