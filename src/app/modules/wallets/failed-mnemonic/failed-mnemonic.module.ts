import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedWalletsModule } from '../shared-wallets/shared-wallets.module';
import { FailedMnemonicPage } from './failed-mnemonic.page';

const routes: Routes = [
  {
    path: '',
    component: FailedMnemonicPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), SharedWalletsModule],
  declarations: [FailedMnemonicPage],
})
export class FailedMnemonicPageModule {}
