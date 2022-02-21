import { NgModule } from '@angular/core';
import { DefiInvestmentWithdrawPage } from './defi-investment-withdraw.page';
import { RouterModule, Routes } from '@angular/router';
import { SharedDefiInvestmentsModule } from '../../shared-defi-investments/shared-defi-investments.module';

const routes: Routes = [
  {
    path: ':vault',
    component: DefiInvestmentWithdrawPage,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes), SharedDefiInvestmentsModule],
  declarations: [DefiInvestmentWithdrawPage],
})
export class DefiInvestmentWithdrawPageModule {}
