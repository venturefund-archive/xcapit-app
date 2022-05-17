import { NgModule } from '@angular/core';
import { SelectAmountWithdrawPage } from './select-amount-withdraw.page';
import { RouterModule, Routes } from '@angular/router';
import { SharedDefiInvestmentsModule } from '../../shared-defi-investments/shared-defi-investments.module';
const routes: Routes = [
  {
    path: '',
    component: SelectAmountWithdrawPage,
  },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes), SharedDefiInvestmentsModule
  ],
  declarations: [SelectAmountWithdrawPage]
})
export class SelectAmountWithdrawPageModule {}
