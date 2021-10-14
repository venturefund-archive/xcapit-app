import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SharedWalletsModule } from '../../shared-wallets/shared-wallets.module';
import { ErrorWrongAddressWalletPage } from './error-wrong-address-wallet.page';

const routes: Routes = [
  {
    path: '',
    component: ErrorWrongAddressWalletPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), SharedWalletsModule],
  declarations: [ErrorWrongAddressWalletPage],
})
export class ErrorWrongAddressWalletPageModule {}
