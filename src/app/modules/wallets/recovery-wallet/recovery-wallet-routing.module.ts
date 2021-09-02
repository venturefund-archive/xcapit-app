import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RecoveryWalletPage } from './recovery-wallet.page';

const routes: Routes = [
  {
    path: '',
    component: RecoveryWalletPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RecoveryWalletPageRoutingModule {}
