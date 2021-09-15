import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { ApikeysTutorialModalComponent } from './components/apikeys-tutorial-modal/apikeys-tutorial-modal.component';
import { QrScannerComponent } from './components/qr-scanner/qr-scanner.component';

@NgModule({
  declarations: [QrScannerComponent, ApikeysTutorialModalComponent],
  imports: [SharedModule],
  exports: [SharedModule, QrScannerComponent, ApikeysTutorialModalComponent],
})
export class SharedApikeysModule {}
