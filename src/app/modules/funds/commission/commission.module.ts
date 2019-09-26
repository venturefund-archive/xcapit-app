import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommissionPage } from './commission.page';
import { SharedFundsModule } from '../shared-funds/shared-funds.module';

const routes: Routes = [
  {
    path: '',
    component: CommissionPage
  }
];

@NgModule({
  imports: [
    SharedFundsModule,
    RouterModule.forChild(routes),
  ],
  declarations: [CommissionPage]
})
export class CommissionPageModule {}
