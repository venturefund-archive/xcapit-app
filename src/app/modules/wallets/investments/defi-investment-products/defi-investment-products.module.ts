import { NgModule } from '@angular/core';
import { DefiInvestmentProductsPage } from './defi-investment-products.page';
import { RouterModule, Routes } from '@angular/router';
import { SharedWalletsModule } from '../../shared-wallets/shared-wallets.module';
const routes: Routes = [
  {
    path: '',
    component: DefiInvestmentProductsPage,
  },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    SharedWalletsModule
  ],
  declarations: [DefiInvestmentProductsPage]
})
export class DefiInvestmentProductsPageModule {}
