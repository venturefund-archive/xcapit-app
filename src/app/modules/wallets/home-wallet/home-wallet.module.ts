import { NgModule } from '@angular/core';
import { HomeWalletPage } from './home-wallet.page';
import { RouterModule, Routes } from '@angular/router';
import { SharedWalletsModule } from '../shared-wallets/shared-wallets.module';
import { __exportStar } from 'tslib';

const routes: Routes = [
  {
    path: '',
    component: HomeWalletPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), SharedWalletsModule],
  declarations: [HomeWalletPage],
})
export class HomeWalletPageModule {}
