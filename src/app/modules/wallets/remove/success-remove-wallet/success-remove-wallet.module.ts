import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedWalletsModule } from '../../shared-wallets/shared-wallets.module';
import { SuccessRemoveWalletPage } from './success-remove-wallet.page';

const routes: Routes = [
  {
    path: '',
    component: SuccessRemoveWalletPage
  }
];

@NgModule({
  imports: [SharedWalletsModule, RouterModule.forChild(routes)],
  declarations: [SuccessRemoveWalletPage],
})
export class SuccessRemoveWalletPageModule {}
