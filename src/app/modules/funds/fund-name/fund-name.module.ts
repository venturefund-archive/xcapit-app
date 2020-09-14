import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FundNamePage } from './fund-name.page';
import { SharedFundsModule } from '../shared-funds/shared-funds.module';

const routes: Routes = [
  {
    path: '',
    component: FundNamePage
  }
];

@NgModule({
  imports: [SharedFundsModule, RouterModule.forChild(routes)],
  declarations: [FundNamePage]
})
export class FundNamePageModule {}
