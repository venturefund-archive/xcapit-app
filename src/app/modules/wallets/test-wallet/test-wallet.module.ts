import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedWalletsModule } from '../shared-wallets/shared-wallets.module';

import { TestWalletPage } from './test-wallet.page';

const routes: Routes = [
  {
    path: '',
    component: TestWalletPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), SharedWalletsModule],
  declarations: [TestWalletPage],
})
export class TestWalletPageModule {}
