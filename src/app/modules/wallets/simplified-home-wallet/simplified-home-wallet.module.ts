import { NgModule } from '@angular/core';
import { SimplifiedHomeWalletPage } from './simplified-home-wallet.page';
import { RouterModule, Routes } from '@angular/router';
import { SharedWalletsModule } from '../shared-wallets/shared-wallets.module';

const routes: Routes = [
  {
    path: '',
    component: SimplifiedHomeWalletPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), SharedWalletsModule],
  declarations: [SimplifiedHomeWalletPage],
})
export class SimplifiedHomeWalletPageModule {}
