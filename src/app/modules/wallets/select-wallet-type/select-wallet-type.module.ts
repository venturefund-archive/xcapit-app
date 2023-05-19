import { NgModule } from '@angular/core';
import { SelectWalletTypePage } from './select-wallet-type.page';
import { RouterModule, Routes } from '@angular/router';
import { SharedWalletsModule } from '../shared-wallets/shared-wallets.module';

const routes: Routes = [
  {
    path: '',
    component: SelectWalletTypePage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), SharedWalletsModule],
  declarations: [SelectWalletTypePage]
})
export class SelectWalletTypePageModule {}
