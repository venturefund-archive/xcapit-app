import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FundAdvancedPage } from './fund-advanced.page';
import { SharedFundsModule } from '../shared-funds/shared-funds.module';

const routes: Routes = [
  {
    path: '',
    component: FundAdvancedPage
  }
];

@NgModule({
  imports: [
    SharedFundsModule,
    RouterModule.forChild(routes),
  ],
  declarations: [FundAdvancedPage]
})
export class FundAdvancedPageModule {}
