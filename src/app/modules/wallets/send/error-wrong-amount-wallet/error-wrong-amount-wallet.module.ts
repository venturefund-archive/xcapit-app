import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SharedWalletsModule } from '../../shared-wallets/shared-wallets.module';
import { ErrorWrongAmountWalletPage } from './error-wrong-amount-wallet.page';

const routes: Routes = [
  {
    path: '',
    component: ErrorWrongAmountWalletPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), SharedWalletsModule],
  declarations: [ErrorWrongAmountWalletPage],
})
export class ErrorWrongAmountWalletPageModule {}
