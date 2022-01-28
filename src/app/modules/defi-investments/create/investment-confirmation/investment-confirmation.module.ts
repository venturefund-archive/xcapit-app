import { InvestmentConfirmationPage } from './investment-confirmation.page';
import { SharedDefiInvestmentsModule } from '../../shared-defi-investments/shared-defi-investments.module';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: InvestmentConfirmationPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), SharedDefiInvestmentsModule],
  declarations: [InvestmentConfirmationPage],
})
export class InvestmentConfirmationPageModule {}
