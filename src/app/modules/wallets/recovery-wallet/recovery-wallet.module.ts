import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RecoveryWalletPageRoutingModule } from './recovery-wallet-routing.module';

import { RecoveryWalletPage } from './recovery-wallet.page';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, RecoveryWalletPageRoutingModule],
  declarations: [RecoveryWalletPage],
})
export class RecoveryWalletPageModule {}
