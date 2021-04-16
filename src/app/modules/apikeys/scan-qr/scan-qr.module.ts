import { NgModule } from '@angular/core';
import { ScanQrPageRoutingModule } from './scan-qr-routing.module';
import { ScanQrPage } from './scan-qr.page';
import { SharedApikeysModule } from '../shared-apikeys/shared-apikeys.module';

@NgModule({
  imports: [
    ScanQrPageRoutingModule,
    SharedApikeysModule
  ],
  declarations: [ScanQrPage]
})
export class ScanQrPageModule {}
