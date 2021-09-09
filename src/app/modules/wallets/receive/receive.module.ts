import { NgModule } from '@angular/core';
import { ReceivePageRoutingModule } from './receive-routing.module';
import { ReceivePage } from './receive.page';
import { SharedWalletsModule } from '../shared-wallets/shared-wallets.module';

@NgModule({
  imports: [ReceivePageRoutingModule, SharedWalletsModule],
  declarations: [ReceivePage],
})
export class ReceivePageModule {}
