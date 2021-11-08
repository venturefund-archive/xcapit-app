import { NgModule } from '@angular/core';
import { RecoveryPhraseReadPage } from './recovery-phrase-read.page';
import { RouterModule, Routes } from '@angular/router';
import { SharedWalletsModule } from '../shared-wallets/shared-wallets.module';

const routes: Routes = [
  {
    path: '',
    component: RecoveryPhraseReadPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), SharedWalletsModule],
  declarations: [RecoveryPhraseReadPage],
})
export class RecoveryPhraseReadPageModule {}
