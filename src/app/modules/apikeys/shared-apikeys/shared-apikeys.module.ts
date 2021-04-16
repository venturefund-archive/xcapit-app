import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { QrScannerComponent } from './components/qr-scanner/qr-scanner.component';

@NgModule({
  declarations: [QrScannerComponent],
  imports: [SharedModule],
  exports: [SharedModule, QrScannerComponent]
})
export class SharedApikeysModule {}
