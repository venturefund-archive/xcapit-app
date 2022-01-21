import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedWalletsModule } from '../../shared-wallets/shared-wallets.module';
import { RemoveWalletPage } from './remove-wallet.page';

const routes: Routes = [
  {
    path: '',
    component: RemoveWalletPage
  }
];

@NgModule({
  imports: [SharedWalletsModule, RouterModule.forChild(routes)],
  declarations:[RemoveWalletPage],
})
export class RemoveWalletPageModule {}
