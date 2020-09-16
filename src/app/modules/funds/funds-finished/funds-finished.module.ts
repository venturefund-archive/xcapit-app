import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FundsFinishedPage } from './funds-finished.page';
import { SharedFundsModule } from '../shared-funds/shared-funds.module';

import {FundFinishedCardComponent} from './components/fund-finished-card/fund-finished-card.component';

const routes: Routes = [
  {
    path: '',
    component: FundsFinishedPage
  }
];

@NgModule({
  imports: [
    SharedFundsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    FundsFinishedPage,
    FundFinishedCardComponent
  ],
  
})
export class FundsFinishedPageModule {}
