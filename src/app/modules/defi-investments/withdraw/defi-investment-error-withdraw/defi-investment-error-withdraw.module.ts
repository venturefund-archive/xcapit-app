import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedDefiInvestmentsModule } from '../../shared-defi-investments/shared-defi-investments.module';
import { DefiInvestmentErrorWithdrawPage } from './defi-investment-error-withdraw.page';

const routes: Routes = [
  {
    path: '',
    component: DefiInvestmentErrorWithdrawPage,
  },
  {
    path: ':vault',
    component: DefiInvestmentErrorWithdrawPage,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes), SharedDefiInvestmentsModule],
  declarations: [DefiInvestmentErrorWithdrawPage],
})
export class DefiInvestmentErrorWithdrawPageModule {}
