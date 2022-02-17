import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NoWalletPage } from './no-wallet.page';

const routes: Routes = [
  {
    path: '',
    component: NoWalletPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NoWalletPageRoutingModule {}
