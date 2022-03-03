import { Component, Inject, OnInit, Renderer2 } from '@angular/core';
import { ModalController, Platform } from '@ionic/angular';
import { DOCUMENT } from '@angular/common';
import { BarcodeScanner, SupportedFormat } from '@capacitor-community/barcode-scanner';

@Component({
  selector: 'app-scan-qr-modal',
  template: `
    <div class="container">
      <div class="barcode-scanner--area--container">
        <ion-row class="relative ion-aling-items-center">
          <ion-col size="12" class="ion-text-center">
            <ion-text color="light" class="ux-fsize-18 ux-fweight-regular ux-font-lato">{{ this.title }}</ion-text>
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
            <ion-text color="light" class="ux-fsize-16 ux-fweight-regular ux-font-lato">{{ this.cancelText }}</ion-text>
          </ion-col>
        </ion-row>
      </div>
    </div>
  `,
  styleUrls: ['./scan-qr-modal.component.scss'],
})
export class ScanQrModalComponent implements OnInit {
  title: string;
  cancelText: string;
  barcodeScanner = BarcodeScanner;

  constructor(
    private modalController: ModalController,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document,
    private platform: Platform
  ) {
    this.platform.backButton.subscribe(() => {
      this.close();
    });
  }

  async ngOnInit() {
    await this.scan();
  }

  async close() {
    await this.barcodeScanner.stopScan();
    await this.showBackground();
    await this.modalController.dismiss(null, 'cancelled');
  }

  private async hideBackground() {
    this.barcodeScanner.hideBackground();
    this.renderer.addClass(this.document.body, 'transparent-background');
    this.renderer.addClass(this.document.getElementsByTagName('ion-split-pane').item(0), 'hidden-visibility');
  }

  private async showBackground() {
    this.barcodeScanner.showBackground();
    this.renderer.removeClass(this.document.body, 'transparent-background');
    this.renderer.removeClass(this.document.getElementsByTagName('ion-split-pane').item(0), 'hidden-visibility');
  }

  private contentOf(result: any): any {
    if (result.hasContent) return result.content;
  }

  private roleOf(result: any): string {
    return result.hasContent ? 'success' : 'error';
  }

  async scan() {
    if (await this.authorized()) {
      await this.hideBackground();
      const result = await this.barcodeScanner.startScan({ targetedFormats: [SupportedFormat.QR_CODE] });
      await this.showBackground();
      await this.modalController.dismiss(this.contentOf(result), this.roleOf(result));
    } else {
      await this.modalController.dismiss(null, 'unauthorized');
    }
  }

  private async authorized(): Promise<boolean> {
    return (await this.barcodeScanner.checkPermission({ force: true })).granted;
  }
}
