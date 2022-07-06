import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedFinancialEducationModule } from '../shared-financial-education/shared-financial-education.module';
import { ErrorNoWalletPage } from './error-no-wallet.page';

const routes: Routes = [
  {
    path: '',
    component: ErrorNoWalletPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), SharedFinancialEducationModule],
  declarations: [ErrorNoWalletPage]
})
export class ErrorNoWalletPageModule {}
