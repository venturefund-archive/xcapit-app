import { NgModule } from '@angular/core';
import { SuccessInvestmentPage } from './success-investment.page';
import { RouterModule, Routes } from '@angular/router';
import { SharedDefiInvestmentsModule } from '../shared-defi-investments/shared-defi-investments.module';

const routes: Routes = [
  {
    path: '',
    component: SuccessInvestmentPage,
  },
];

@NgModule({
  imports: [SharedDefiInvestmentsModule, RouterModule.forChild(routes)],
  declarations: [SuccessInvestmentPage],
})
export class SuccessInvestmentPageModule {}
