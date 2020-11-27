import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FundOperationsDetailPage } from './fund-operations-detail.page';
import { SharedFundsModule } from '../shared-funds/shared-funds.module';

const routes: Routes = [
  {
    path: '',
    component: FundOperationsDetailPage,
  },
];

@NgModule({
  imports: [SharedFundsModule, RouterModule.forChild(routes)],
  declarations: [FundOperationsDetailPage],
})
export class FundOperationsDetailPageModule {}
