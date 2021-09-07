import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SharedWalletsModule } from '../shared-wallets/shared-wallets.module';
import { TransactionsWalletPage } from './transactions-wallet.page';

const routes: Routes = [
  {
    path: '',
    component: TransactionsWalletPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), SharedWalletsModule],
  declarations: [TransactionsWalletPage],
})
export class TransactionsWalletPageModule {}
