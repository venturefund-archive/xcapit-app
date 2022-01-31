import { SharedDefiInvestmentsModule } from '../../shared-defi-investments/shared-defi-investments.module';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewInvestmentPage } from './new-investment.page';

const routes: Routes = [
  {
    path: '',
    component: NewInvestmentPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), SharedDefiInvestmentsModule],
  declarations: [NewInvestmentPage],
})
export class NewInvestmentPageModule {}
