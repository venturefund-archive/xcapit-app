import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Plugins } from '@capacitor/core';
import { Platform } from '@ionic/angular';

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

  constructor(private platform: Platform) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.error = false;
    this.scanningQR = false;

    this.platform.backButton.subscribe(
      () => this.close()
    );
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
    const hasPermission = this.checkPermission();

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

    const { BarcodeScanner } = Plugins;
    const result = await BarcodeScanner.startScan({
      targetedFormats: ['QR_CODE'],
    });

    this.showBackground();
    this.scanningQR = false;

    return result;
  }

  async checkPermission(): Promise<boolean> {
    const { BarcodeScanner } = Plugins;

    const status = await BarcodeScanner.checkPermission({ force: true });

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
    const { BarcodeScanner } = Plugins;
    BarcodeScanner.hideBackground();
    document.getElementsByTagName('html').item(0).classList.add('hidden');
  }

  showBackground() {
    document.getElementsByTagName('html').item(0).classList.remove('hidden');
  }

  stopQRScan() {
    const { BarcodeScanner } = Plugins;
    BarcodeScanner.stopScan();
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
