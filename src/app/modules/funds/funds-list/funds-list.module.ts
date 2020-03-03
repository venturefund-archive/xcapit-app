import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FundsListPage } from './funds-list.page';
import { SharedFundsModule } from '../shared-funds/shared-funds.module';


const routes: Routes = [
  {
    path: '',
    component: FundsListPage
  }
];

@NgModule({
  imports: [
    SharedFundsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [FundsListPage]
})
export class FundsListPageModule {}
