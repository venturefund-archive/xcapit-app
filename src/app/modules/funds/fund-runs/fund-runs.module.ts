import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FundRunsPage } from './fund-runs.page';
import { SharedFundsModule } from '../shared-funds/shared-funds.module';

const routes: Routes = [
  {
    path: '',
    component: FundRunsPage
  }
];

@NgModule({
  imports: [
    SharedFundsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [FundRunsPage]
})
export class FundRunsPageModule {}
