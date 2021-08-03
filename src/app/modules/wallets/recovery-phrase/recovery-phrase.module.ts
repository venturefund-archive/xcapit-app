import { NgModule } from '@angular/core';
import { RecoveryPhrasePage } from './recovery-phrase.page';
import { RouterModule, Routes } from '@angular/router';
import { SharedWalletsModule } from '../shared-wallets/shared-wallets.module';

const routes: Routes = [
  {
    path: '',
    component: RecoveryPhrasePage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), SharedWalletsModule],
  declarations: [RecoveryPhrasePage],
})
export class RecoveryPhrasePageModule {}
