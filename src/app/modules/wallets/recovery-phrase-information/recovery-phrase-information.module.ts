import { NgModule } from '@angular/core';
import { RecoveryPhraseInformationPage } from './recovery-phrase-information.page';
import { RouterModule, Routes } from '@angular/router';
import { SharedWalletsModule } from '../shared-wallets/shared-wallets.module';

const routes: Routes = [
  {
    path: '',
    component: RecoveryPhraseInformationPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), SharedWalletsModule],
  declarations: [RecoveryPhraseInformationPage],
})
export class RecoveryPhraseInformationPageModule {}
