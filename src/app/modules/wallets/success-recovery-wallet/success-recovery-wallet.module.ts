import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SharedWalletsModule } from '../shared-wallets/shared-wallets.module';

import { SuccessRecoveryWalletPage } from './success-recovery-wallet.page';

const routes: Routes = [
  {
    path: '',
    component: SuccessRecoveryWalletPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), SharedWalletsModule],
  declarations: [SuccessRecoveryWalletPage],
})
export class SuccessRecoveryWalletPageModule {}
