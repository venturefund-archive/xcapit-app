import { NgModule } from '@angular/core';
import { WalletPasswordChangePage } from './wallet-password-change.page';
import { RouterModule, Routes } from '@angular/router';
import { SharedWalletsModule } from '../../shared-wallets/shared-wallets.module';

const routes: Routes = [
  {
    path: '',
    component: WalletPasswordChangePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes), SharedWalletsModule],
  declarations: [WalletPasswordChangePage],
})
export class WalletPasswordChangePageModule {}
