import { NgModule } from '@angular/core';
import { ReceiveSelectCurrencyPage } from './receive-select-currency.page';
import { RouterModule, Routes } from '@angular/router';
import { SharedWalletsModule } from '../shared-wallets/shared-wallets.module';

const routes: Routes = [
  {
    path: '',
    component: ReceiveSelectCurrencyPage,
  },
];

@NgModule({
  declarations: [ReceiveSelectCurrencyPage],
  imports: [RouterModule.forChild(routes), SharedWalletsModule],
  exports: [RouterModule]
})
export class ReceiveSelectCurrencyPageModule {}
