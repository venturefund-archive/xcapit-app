import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FundDurationPage } from './fund-duration.page';
import { SharedFundsModule } from '../shared-funds/shared-funds.module';

const routes: Routes = [
  {
    path: '',
    component: FundDurationPage
  }
];

@NgModule({
  imports: [SharedFundsModule, RouterModule.forChild(routes)],
  declarations: [FundDurationPage]
})
export class FundDurationPageModule {}
