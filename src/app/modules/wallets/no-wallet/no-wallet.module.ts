import { NgModule } from '@angular/core';
import { NoWalletPageRoutingModule } from './no-wallet-routing.module';
import { NoWalletPage } from './no-wallet.page';
import { SharedWalletsModule } from '../shared-wallets/shared-wallets.module';

@NgModule({
  imports: [SharedWalletsModule, NoWalletPageRoutingModule],
  declarations: [NoWalletPage],
})
export class NoWalletPageModule {}
