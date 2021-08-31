import { NgModule } from '@angular/core';
import { SendDetailPageRoutingModule } from './send-detail-routing.module';
import { SendDetailPage } from './send-detail.page';
import { SharedWalletsModule } from '../../shared-wallets/shared-wallets.module';

@NgModule({
  imports: [SharedWalletsModule, SendDetailPageRoutingModule],
  declarations: [SendDetailPage],
})
export class SendDetailPageModule {}
