import { NgModule } from '@angular/core';
import { RecoveryPhraseNoWalletPage } from './recovery-phrase-no-wallet.page';
import { RouterModule, Routes } from '@angular/router';
import { SharedWalletsModule } from '../shared-wallets/shared-wallets.module';

const routes: Routes = [
  {
    path: '',
    component: RecoveryPhraseNoWalletPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), SharedWalletsModule],
  declarations: [RecoveryPhraseNoWalletPage],
})
export class RecoveryPhraseNoWalletPageModule {}
