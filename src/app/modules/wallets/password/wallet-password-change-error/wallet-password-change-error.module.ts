import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedWalletsModule } from '../../shared-wallets/shared-wallets.module';
import { WalletPasswordChangeErrorPage } from './wallet-password-change-error.page';

const routes: Routes = [
  {
    path: '',
    component: WalletPasswordChangeErrorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes), SharedWalletsModule],
  declarations: [WalletPasswordChangeErrorPage]
})
export class WalletPasswordChangeErrorPageModule {}
