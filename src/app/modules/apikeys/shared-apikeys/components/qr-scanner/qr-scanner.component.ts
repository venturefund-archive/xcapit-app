import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Plugins } from '@capacitor/core';
import { Platform } from '@ionic/angular';

const { BarcodeScanner } = Plugins;
@Component({
  selector: 'app-qr-scanner',
  template: `
    <div class="container">
      <div class="barcode-scanner--area--container">
        <div class="relative">
          <p>{{ 'apikeys.qr_scanner.text' | translate }}</p>
        </div>
        <div class="square surround-cover">
          <div class="barcode-scanner--area--outer surround-cover">
            <div class="barcode-scanner--area--inner"></div>
          </div>
        </div>
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
      </div>
    </div>
  `,
  styleUrls: ['./qr-scanner.component.scss'],
})
export class QrScannerComponent implements OnInit {
  @Output() scannedApikeysEvent = new EventEmitter<any>();
  scannedApikeys: any;
  scanningQR: boolean;
  error: boolean;
  barcodeScanner = BarcodeScanner;

  constructor(private platform: Platform) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.error = false;
    this.scanningQR = false;

    this.platform.backButton.subscribe(() => this.close());
  }

  apikeyScannedSuccessfullyEvent() {
    const result = {
      error: false,
      scannedApikeys: this.scannedApikeys,
    };

    this.scannedApikeysEvent.emit(result);
  }

  errorInvalidQREvent() {
    const result = {
      error: true,
      errorType: 'invalidQR',
    };

    this.scannedApikeysEvent.emit(result);
  }

  errorNoContentQREvent() {
    const result = {
      error: true,
      errorType: 'noContent',
    };

    this.scannedApikeysEvent.emit(result);
  }

  errorCameraAccessDeniedEvent() {
    const result = {
      error: true,
      errorType: 'permissionDenied',
    };

    this.scannedApikeysEvent.emit(result);
  }

  scanStoppedEvent() {
    const result = {
      error: false,
    };

    this.scannedApikeysEvent.emit(result);
  }

  async readQRCode() {
    const hasPermission = await this.checkPermission();

    if (hasPermission) {
      const result = await this.scanQR();

      if (result.hasContent) {
        if (this.isValidQR(result.content)) {
          this.formatQRResult(result.content);
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

  formatQRResult(result: string) {
    const parsedResult = JSON.parse(result);

    this.scannedApikeys = {
      alias: parsedResult.comment,
      api_key: parsedResult.apiKey,
      secret_key: parsedResult.secretKey,
    };

    this.apikeyScannedSuccessfullyEvent();
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
    this.scanStoppedEvent();
  }

  isValidQR(content: string): boolean {
    let parsedResult;
    try {
      parsedResult = JSON.parse(content);
    } catch (e) {
      return false;
    }

    return (
      parsedResult.hasOwnProperty('apiKey') &&
      parsedResult.hasOwnProperty('secretKey') &&
      parsedResult.hasOwnProperty('comment')
    );
  }

  close() {
    if (this.scanningQR) {
      this.stopQRScan();
    }
  }
}
