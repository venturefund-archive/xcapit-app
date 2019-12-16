import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FundCreatedPage } from './fund-created.page';
import { SharedFundsModule } from '../shared-funds/shared-funds.module';

const routes: Routes = [
  {
    path: '',
    component: FundCreatedPage
  }
];

@NgModule({
  imports: [
    SharedFundsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [FundCreatedPage]
})
export class FundCreatedPageModule {}
