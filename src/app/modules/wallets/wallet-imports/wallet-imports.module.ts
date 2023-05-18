import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedWalletsModule } from '../shared-wallets/shared-wallets.module';
import { WalletImportsPage } from './wallet-imports.page';

const routes: Routes = [
  {
    path: '',
    component: WalletImportsPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), SharedWalletsModule],
  declarations: [WalletImportsPage],
})
export class WalletImportsPageModule {}
