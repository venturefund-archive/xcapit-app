import { NgModule } from '@angular/core';
import { SendSuccessPageRoutingModule } from './send-success-routing.module';
import { SendSuccessPage } from './send-success.page';
import { SharedWalletsModule } from '../../shared-wallets/shared-wallets.module';

@NgModule({
  imports: [SendSuccessPageRoutingModule, SharedWalletsModule],
  declarations: [SendSuccessPage],
})
export class SendSuccessPageModule {}
