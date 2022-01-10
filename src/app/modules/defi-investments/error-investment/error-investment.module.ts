import { NgModule } from '@angular/core';
import { ErrorInvestmentPage } from './error-investment.page';
import { RouterModule, Routes } from '@angular/router';
import { SharedDefiInvestmentsModule } from '../shared-defi-investments/shared-defi-investments.module';

const routes: Routes = [
  {
    path: '',
    component: ErrorInvestmentPage
  }
];

@NgModule({
  imports: [SharedDefiInvestmentsModule ,RouterModule.forChild(routes)],
  declarations: [ErrorInvestmentPage],
})
export class ErrorInvestmentPageModule {}
