import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SharedWalletsModule } from '../../shared-wallets/shared-wallets.module';
import { ErrorIncorrectPasswordWalletPage } from './error-incorrect-password-wallet.page';

const routes: Routes = [
  {
    path: '',
    component: ErrorIncorrectPasswordWalletPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), SharedWalletsModule],
  declarations: [ErrorIncorrectPasswordWalletPage],
})
export class ErrorIncorrectPasswordWalletPageModule {}
