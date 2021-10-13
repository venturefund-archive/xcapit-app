import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SharedWalletsModule } from '../shared-wallets/shared-wallets.module';

import { ErrorRecoveryWalletPage } from './error-recovery-wallet.page';

const routes: Routes = [
  {
    path: '',
    component: ErrorRecoveryWalletPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), SharedWalletsModule],
  declarations: [ErrorRecoveryWalletPage],
})
export class ErrorRecoveryWalletPageModule {}
