import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedWalletsModule } from '../shared-wallets/shared-wallets.module';
import { DisclaimerWalletPage } from './disclaimer-wallet.page';

const routes: Routes = [
  {
    path: '',
    component: DisclaimerWalletPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), SharedWalletsModule],
  declarations: [DisclaimerWalletPage],
})
export class DisclaimerWalletPageModule {}
