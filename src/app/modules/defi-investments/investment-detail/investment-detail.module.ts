import { NgModule } from '@angular/core';
import { InvestmentDetailPage } from './investment-detail.page';
import { SharedDefiInvestmentsModule } from '../shared-defi-investments/shared-defi-investments.module';
import { RouterModule, Routes } from '@angular/router';
const routes: Routes = [
  {
    path: '',
    component: InvestmentDetailPage,
  },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    SharedDefiInvestmentsModule
  ],
  declarations: [InvestmentDetailPage]
})
export class InvestmentDetailPageModule {}
