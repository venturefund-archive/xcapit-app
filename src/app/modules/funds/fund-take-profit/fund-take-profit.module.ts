import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FundTakeProfitPage } from './fund-take-profit.page';
import { SharedFundsModule } from '../shared-funds/shared-funds.module';

const routes: Routes = [
  {
    path: '',
    component: FundTakeProfitPage
  }
];

@NgModule({
  imports: [SharedFundsModule, RouterModule.forChild(routes)],
  declarations: [FundTakeProfitPage],
  entryComponents: []
})
export class FundTakeProfitPageModule {}
