import { NgModule } from '@angular/core';
import { NoWalletPage } from './no-wallet.page';
import { SharedWalletsModule } from '../shared-wallets/shared-wallets.module';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: NoWalletPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), SharedWalletsModule],
  declarations: [NoWalletPage],
})
export class NoWalletPageModule {}
