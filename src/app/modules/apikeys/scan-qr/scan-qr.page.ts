import { Component, OnInit, ViewChild } from '@angular/core';
import { StorageApikeysService } from '../shared-apikeys/services/storage-apikeys/storage-apikeys.service';
import { ToastService } from '../../../shared/services/toast/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { NavController } from '@ionic/angular';
import { QrScannerComponent } from '../shared-apikeys/components/qr-scanner/qr-scanner.component';

@Component({
  selector: 'app-scan-qr',
  template: `
    <ion-header>
      <ion-toolbar color="uxprimary" class="ux_toolbar">
        <ion-title class="ion-text-center">{{ 'apikeys.scan_qr.header' | translate }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <app-qr-scanner
        (stoppedScan)="this.stoppedScan()"
        (scannedApikeysEvent)="this.apiKeysScanned($event)"
      ></app-qr-scanner>
    </ion-content>
  `,
  styleUrls: ['./scan-qr.page.scss'],
})
export class ScanQrPage implements OnInit {
  @ViewChild(QrScannerComponent) qrScanner: QrScannerComponent;

  constructor(
    private storageApiKeysService: StorageApikeysService,
    private toastService: ToastService,
    private translate: TranslateService,
    private navController: NavController
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.readQRCode();
  }

  apiKeysScanned(result: any) {
    if (result.error) {
      this.showErrorToast(result.errorType);
    } else {
      if (result.scannedApikeys) {
        this.storageApiKeysService.updateData({ ...result.scannedApikeys, exchange: 'binance' });
        this.navController.navigateBack(['/apikeys/register']).then();
      }
    }
  }

  readQRCode() {
    this.qrScanner.readQRCode();
  }

  stopQRScan() {
    this.qrScanner.stopQRScan();
  }

  registerManually() {
    this.stopQRScan();
    this.navController.navigateBack(['/apikeys/register']).then();
  }

  private showErrorToast(errorCode: string) {
    const errorPrefix = 'apikeys.scan_qr.errors.';
    this.toastService
      .showToast({
        message: this.translate.instant(`${errorPrefix}${errorCode}`),
      })
      .then();
  }

  stoppedScan() {
    this.navController.navigateBack(['/apikeys/register']).then();
  }

  ionViewDidLeave() {
    this.stopQRScan();
  }
}
