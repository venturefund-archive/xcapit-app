import { Component } from '@angular/core';
import { QrScannerComponent } from './qr-scanner.component';

@Component({
  selector: 'app-qr-scanner',
  template: '',
  providers: [
    {
      provide: QrScannerComponent,
      useClass: QrScannerStubComponent,
    },
  ],
})
export class QrScannerStubComponent {
  stopQRScan() {}

  readQRCode() {}
}
