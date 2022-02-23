import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedDefiInvestmentsModule } from '../../shared-defi-investments/shared-defi-investments.module';
import { DefiInvestmentSuccessWithdrawPage } from './defi-investment-success-withdraw.page';

const routes: Routes = [
  {
    path: '',
    component: DefiInvestmentSuccessWithdrawPage,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes), SharedDefiInvestmentsModule],
  declarations: [DefiInvestmentSuccessWithdrawPage],
})
export class DefiInvestmentSuccessWithdrawPageModule {}
