import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Filesystem } from '@capacitor/filesystem';
import { NavController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { addHours } from 'date-fns';
import { ClipboardService } from 'src/app/shared/services/clipboard/clipboard.service';
import { PlatformService } from 'src/app/shared/services/platform/platform.service';
import { ToastService } from 'src/app/shared/services/toast/toast.service';
import { Coin } from '../../wallets/shared-wallets/interfaces/coin.interface';
import { ApiWalletService } from '../../wallets/shared-wallets/services/api-wallet/api-wallet.service';
import { OperationDataInterface } from '../shared-ramps/interfaces/operation-data.interface';
import { FiatRampsService } from '../shared-ramps/services/fiat-ramps.service';
import { StorageOperationService } from '../shared-ramps/services/operation/storage-operation.service';

@Component({
  selector: 'app-purchase-order',
  template: `
    <ion-header>
      <ion-toolbar mode="ios" color="primary" class="ux_toolbar ux_toolbar__left no-border">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/fiat-ramps/purchases"></ion-back-button>
        </ion-buttons>
        <ion-title class="po__header">
          {{ 'fiat_ramps.purchase_order.header' | translate }}
        </ion-title>
        <ion-label class="ux-font-text-xs step_counter" slot="end"
          >{{ this.step }} {{ 'shared.step_counter.of' | translate }} 2</ion-label
        >
      </ion-toolbar>
    </ion-header>
    <ion-content *ngIf="this.data" class="po">
      <div class="po__provider">
        <ion-text class="ux-font-text-xxs">{{ 'fiat_ramps.purchase_order.provider' | translate }}</ion-text>
      </div>

      <div class="po__step-wrapper">
        <div class="po__step-wrapper__step" [ngClass]="this.isFirstStep ? 'active' : 'success'">
          <div class="po__step-wrapper__step__number number first">
            <ion-label *ngIf="this.isFirstStep" class="ux-font-text-lg">1</ion-label>
            <div class="icon" *ngIf="!this.isFirstStep">
              <ion-icon name="check-circle" color="success"></ion-icon>
            </div>
          </div>
          <ion-label class="po__step-wrapper__step__title title ux-font-titulo-xs">{{
            'fiat_ramps.purchase_order.step_1' | translate
          }}</ion-label>
        </div>
        <div class="po__step-wrapper__step" [ngClass]="this.isFirstStep ? 'inactive' : 'active'">
          <div class="po__step-wrapper__step__number number">
            <ion-label class="ux-font-text-lg">2</ion-label>
          </div>
          <ion-label class="po__step-wrapper__step__title title ux-font-titulo-xs">{{
            'fiat_ramps.purchase_order.step_2' | translate
          }}</ion-label>
        </div>
      </div>
      <app-voucher-card
        *ngIf="!this.isFirstStep"
        [voucher]="this.voucher"
        [percentage]="this.percentage"
        (addPhoto)="this.addPhoto()"
        (removePhoto)="this.removePhoto()"
      ></app-voucher-card>
      <app-kripton-account-info-card
        *ngIf="this.isFirstStep"
        [country]="this.data.country.toLowerCase()"
        [amount]="this.data.amount_in"
        [currency]="this.data.currency_in.toUpperCase()"
        (copyValue)="this.copyToClipboard($event)"
      ></app-kripton-account-info-card>
      <app-kripton-purchase-info
        [currencyOut]="this.currencyOut"
        [currencyIn]="this.data.currency_in"
        [priceOut]="this.data.price_out"
        [operationId]="this.data.operation_id"
        [amountOut]="this.data.amount_out"
      ></app-kripton-purchase-info>
    </ion-content>
    <ion-footer class="po__footer ion-padding ux_footer">
      <app-timer-countdown
        class="timer"
        text="fiat_ramps.purchase_order.timer"
        [deadlineDate]="dDay"
        [showSeconds]="false"
      ></app-timer-countdown>
      <ion-button name="Continue" expand="block" size="large" class="ux_button" color="secondary" (click)="this.goToNextStep()">{{
        'fiat_ramps.purchase_order.button' | translate
      }}</ion-button>
    </ion-footer>
  `,
  styleUrls: ['./purchase-order.page.scss'],
})
export class PurchaseOrderPage {
  isFirstStep: boolean;
  dDay = addHours(new Date(), 72);
  data: OperationDataInterface;
  currencyOut: Coin;
  step: number;
  voucher: Photo;
  percentage = -1;
  filesystemPlugin = Filesystem;
  cameraPlugin = Camera;

  constructor(
    private clipboardService: ClipboardService,
    private toastService: ToastService,
    private translate: TranslateService,
    private storageOperationService: StorageOperationService,
    private route: ActivatedRoute,
    private apiWalletService: ApiWalletService,
    private navController: NavController,
    private platformService: PlatformService,
    private fiatRampsService: FiatRampsService
  ) {}

  ionViewWillEnter() {
    this.getStep();
    this.getData();
    this.getCurrencyOut();
  }

  private getCurrencyOut() {
    this.currencyOut = this.apiWalletService.getCoin(this.data.currency_out, this.data.network);
  }

  private getStep() {
    this.step = parseInt(this.route.snapshot.paramMap.get('step'));
    this.isFirstStep = this.step === 1;
  }

  private getData() {
    this.data = this.storageOperationService.getData();
  }

  copyToClipboard(clipboardInfo) {
    this.clipboardService.write({ string: clipboardInfo.value }).then(() => {
      this.showToastOf(clipboardInfo.modalText);
    });
  }

  private showToastOf(modalText) {
    this.toastService.showInfoToast({
      message: this.translate.instant('fiat_ramps.purchase_order.clipboard_text', {
        type: this.translate.instant(modalText),
      }),
    });
  }

  goToNextStep() {
    this.navController.navigateForward(['/fiat-ramps/purchase-order/2'], {animated: false});
  }

  async addPhoto() {
    this.percentage = 0;
    if (this.platformService.isNative()) {
      const filePermissions = await this.filesystemPlugin.requestPermissions();
      const cameraPermissions = await this.cameraPlugin.requestPermissions();
      const photo = await this.cameraPlugin.getPhoto({
        source: CameraSource.Prompt,
        saveToGallery: false,
        resultType: CameraResultType.DataUrl,
      });

      this.voucher = photo;
    } else {
      // TOOD: Delete this
      setTimeout(() => this.percentage = 12, 100);
      this.voucher = {} as Photo;
      setTimeout(() => this.percentage = 100, 500);
    }
  }

  async sendPicture() {
    // this.percentage = true;
    const formData = new FormData();
    formData.append('file', this.voucher.dataUrl);
    this.fiatRampsService.confirmOperation(this.data.operation_id, formData).subscribe({
      next: (data) => {
        this.voucher = undefined;
        this.data.voucher = true;
        // this.percentage = false;
      },
      error: () => (this.percentage = -1),
    });

  }

  navigateBackToOperations() {
    this.navController.navigateBack(['/fiat-ramps/select-provider']);
  }

  removePhoto() {
    this.voucher = undefined;
  }

  // async showRemovePhotoModal() {
  //   if (this.isInfoModalOpen === false) {
  //     this.isInfoModalOpen = true;
  //     const modal = await this.modalController.create({
  //       component: SkipTransactionVoucherComponent,
  //       componentProps: {
  //         title: this.translate.instant('fiat_ramps.operation_detail.remove_photo.title'),
  //         description: this.translate.instant('fiat_ramps.operation_detail.remove_photo.description'),
  //         buttonText1: this.translate.instant('fiat_ramps.operation_detail.remove_photo.button_text1'),
  //         buttonText2: this.translate.instant('fiat_ramps.operation_detail.remove_photo.button_text2'),
  //       },
  //       cssClass: 'modal',
  //       backdropDismiss: false,
  //     });
  //     await modal.present();
  //     const { data } = await modal.onDidDismiss();
  //     if (data === 'secondaryAction') {
  //       this.removePhoto();
  //     }
  //     this.isInfoModalOpen = false;
  //   }
  // }

}
