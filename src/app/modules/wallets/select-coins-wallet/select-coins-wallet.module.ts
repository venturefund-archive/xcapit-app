import { NgModule } from '@angular/core';
import { SelectCoinsWalletPage } from './select-coins-wallet.page';
import { RouterModule, Routes } from '@angular/router';
import { SharedWalletsModule } from '../shared-wallets/shared-wallets.module';
import { ItemCoinComponent } from '../shared-wallets/components/item-coin/item-coin.component';

const routes: Routes = [
  {
    path: '',
    component: SelectCoinsWalletPage,
  },
  {
    path: ':mode',
    component: SelectCoinsWalletPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), SharedWalletsModule],
  declarations: [SelectCoinsWalletPage],
})
export class SelectCoinsWalletPageModule {}
