import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Plugins } from '@capacitor/core';
import { Platform } from '@ionic/angular';
import { AlertController, ModalController } from '@ionic/angular';
import { ToastService } from '../../../../../shared/services/toast/toast.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-wallet-connect-qr-scan',
  template: `
    <ion-content>
      <div class="container">
        <div class="barcode-scanner--area--container">
          <ion-row class="relative ion-aling-items-center">
            <ion-col size="12" class="ion-text-center">
              <ion-text class="ux-font-text-base title">{{
                'wallets.wallet_connect.scan_qr.header' | translate
              }}</ion-text>
            </ion-col>
          </ion-row>
          <ion-row class="square surround-cover">
            <div class="barcode-scanner--area--outer surround-cover">
              <div class="barcode-scanner--area--inner"></div>
            </div>
          </ion-row>
          <ion-row class="ion-align-items-center">
            <ion-col size="12" class="ion-text-center">
              <ion-button
                appTrackClick
                name="Cancel"
                class="close-button"
                color="light"
                size="large"
                fill="outline"
                shape="round"
                (click)="this.close()"
              >
                <ion-icon name="close-outline"></ion-icon>
              </ion-button>
            </ion-col>
          </ion-row>
          <ion-row class="ion-align-items-center">
            <ion-col size="5" class="ion-text-center center">
              <ion-text class="ux-font-text-base button-text">{{
                'wallets.wallet_connect.qr_scanner.cancel_label' | translate
              }}</ion-text>
            </ion-col>
          </ion-row>
        </div>
      </div>
    </ion-content>
  `,
  styleUrls: ['./wallet-connect-qr-scan.component.scss'],
})
export class WalletConnectQrScanComponent implements OnInit {
  @Output() scannedQREvent = new EventEmitter<any>();
  @Output() stoppedScan = new EventEmitter<any>();
  scannedQR: any;
  scanningQR = false;
  error: boolean;
  barcodeScanner = Plugins.BarcodeScanner;

  constructor(
    private platform: Platform,
    private modalController: ModalController,
    private toastService: ToastService,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    this.readQRCode();
  }

  ionViewWillEnter() {
    this.error = false;
    this.platform.backButton.subscribe(() => this.close());
  }

  qrScannedSuccessfullyEvent() {
    const data = {
      error: false,
      scannedQR: this.scannedQR,
    };

    this.modalController.dismiss(data);
  }

  errorInvalidQREvent() {
    this.showErrorToast('invalidQR');
  }

  errorNoContentQREvent() {
    this.showErrorToast('noContent');
  }

  errorCameraAccessDeniedEvent() {
    this.showErrorToast('permissionDenied');
  }

  private showErrorToast(errorCode: string) {
    const errorPrefix = 'wallets.wallet_connect.scan_qr.errors.';
    this.toastService
      .showToast({
        message: this.translate.instant(`${errorPrefix}${errorCode}`),
      })
      .then();
  }

  async readQRCode() {
    const hasPermission = await this.checkPermission();

    if (hasPermission) {
      const result = await this.scanQR();

      if (result.hasContent) {
        if (this.isValidQR(result.content)) {
          this.scannedQR = result.content;
          this.qrScannedSuccessfullyEvent();
        } else {
          this.errorInvalidQREvent();
        }
      } else {
        this.errorNoContentQREvent();
      }
    } else {
      this.errorCameraAccessDeniedEvent();
    }
  }

  async scanQR() {
    this.scanningQR = true;
    this.hideBackground();

    const result = await this.barcodeScanner.startScan({
      targetedFormats: ['QR_CODE'],
    });

    this.showBackground();
    this.scanningQR = false;

    return result;
  }

  async checkPermission() {
    const status = await this.barcodeScanner.checkPermission({ force: true });

    if (status.granted) {
      return true;
    }

    return false;
  }

  hideBackground() {
    this.barcodeScanner.hideBackground();
    document.getElementsByTagName('html').item(0).classList.add('hidden');
  }

  showBackground() {
    document.getElementsByTagName('html').item(0).classList.remove('hidden');
  }

  stopQRScan() {
    this.barcodeScanner.stopScan();
    this.showBackground();
    this.scanningQR = false;
    this.modalController.dismiss();
  }

  isValidQR(content: string): boolean {
    return content.includes('wc:') && content.includes('bridge');
  }

  close() {
    if (this.scanningQR) {
      this.stopQRScan();
    }
  }
}
