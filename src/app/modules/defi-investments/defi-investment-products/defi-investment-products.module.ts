import { NgModule } from '@angular/core';
import { DefiInvestmentProductsPage } from './defi-investment-products.page';
import { RouterModule, Routes } from '@angular/router';
import { SharedDefiInvestmentsModule } from '../shared-defi-investments/shared-defi-investments.module';
const routes: Routes = [
  {
    path: '',
    component: DefiInvestmentProductsPage,
  },
];
@NgModule({
  imports: [
    RouterModule.forChild(routes),
    SharedDefiInvestmentsModule,
  ],
  declarations: [DefiInvestmentProductsPage]
})
export class DefiInvestmentProductsPageModule {}
