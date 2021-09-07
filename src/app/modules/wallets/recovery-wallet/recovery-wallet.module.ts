import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RecoveryWalletPage } from './recovery-wallet.page';
import { RouterModule, Routes } from '@angular/router';
import { SharedWalletsModule } from '../shared-wallets/shared-wallets.module';
import { RecoveryWalletFormComponent } from '../shared-wallets/components/recovery-wallet-form/recovery-wallet-form.component';

const routes: Routes = [
  {
    path: '',
    component: RecoveryWalletPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), SharedWalletsModule],
  declarations: [RecoveryWalletPage, RecoveryWalletFormComponent],
})
export class RecoveryWalletPageModule {}
