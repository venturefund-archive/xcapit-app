import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedWalletsModule } from '../../shared-wallets/shared-wallets.module';
import { WalletPasswordChangeSuccessPage } from './wallet-password-change-success.page';

const routes: Routes = [
  {
    path: '',
    component: WalletPasswordChangeSuccessPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes), SharedWalletsModule],
  declarations: [WalletPasswordChangeSuccessPage]
})
export class WalletPasswordChangeSuccessPageModule {}
