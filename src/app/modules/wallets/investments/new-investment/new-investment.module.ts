import { SharedWalletsModule } from './../../shared-wallets/shared-wallets.module';
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
  imports: [RouterModule.forChild(routes), SharedWalletsModule],
  declarations: [NewInvestmentPage],
})
export class NewInvestmentPageModule {}
