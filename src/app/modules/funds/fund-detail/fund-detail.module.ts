import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FundDetailPage } from './fund-detail.page';
import { SharedFundsModule } from '../shared-funds/shared-funds.module';

const routes: Routes = [
  {
    path: '',
    component: FundDetailPage
  }
];
@NgModule({
  imports: [SharedFundsModule, RouterModule.forChild(routes)],
  declarations: [FundDetailPage]
})
export class FundDetailPageModule {}
