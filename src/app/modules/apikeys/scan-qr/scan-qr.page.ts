import { Component, OnInit, ViewChild } from '@angular/core';
import { StorageApikeysService } from '../shared-apikeys/services/storage-apikeys/storage-apikeys.service';
import { ToastService } from '../../../shared/services/toast/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { NavController } from '@ionic/angular';
import { QrScannerComponent } from '../shared-apikeys/components/qr-scanner/qr-scanner.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-scan-qr',
  template: `
    <ion-header>
      <ion-toolbar color="uxprimary" class="ux_toolbar">
        <ion-title>{{ 'apikeys.scan_qr.header' | translate }}</ion-title>
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
  isTutorialStep = false;
  constructor(
    private storageApiKeysService: StorageApikeysService,
    private toastService: ToastService,
    private translate: TranslateService,
    private navController: NavController,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.isTutorialStep = this.route.snapshot.paramMap.get('isTutorialStep') === 'true';
    this.readQRCode();
  }

  apiKeysScanned(result: any) {
    if (result.error) {
      this.showErrorToast(result.errorType);
      this.qrScanner.readQRCode();
    }
    if (result.scannedApikeys) {
      this.storageApiKeysService.updateData({ ...result.scannedApikeys, exchange: 'binance' });
      this.navigateBackToRegister();
    }
  }

  readQRCode() {
    this.qrScanner.readQRCode();
  }

  stopQRScan() {
    this.qrScanner.stopQRScan();
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
    this.navigateBackToRegister();
  }

  ionViewDidLeave() {
    this.stopQRScan();
  }

  navigateBackToRegister() {
    const url = this.isTutorialStep ? '/apikeys/tutorial/register' : '/apikeys/register';
    this.navController.navigateBack([url]).then();
  }
}
