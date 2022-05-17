import { NgModule } from '@angular/core';
import { WithdrawConfirmationPage } from './withdraw-confirmation.page';
import { RouterModule, Routes } from '@angular/router';
import { SharedDefiInvestmentsModule } from '../../shared-defi-investments/shared-defi-investments.module';

const routes: Routes = [
  {
    path: ':vault/:type',
    component: WithdrawConfirmationPage,
  },
  {
    path: ':vault',
    component: WithdrawConfirmationPage,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes), SharedDefiInvestmentsModule],
  declarations: [WithdrawConfirmationPage],
})
export class WithdrawConfirmationPageModule {}
