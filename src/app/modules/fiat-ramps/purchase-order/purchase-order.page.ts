import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Camera, CameraResultType, CameraSource, ImageOptions, Photo } from '@capacitor/camera';
import { Filesystem } from '@capacitor/filesystem';
import { ModalController, NavController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { addHours } from 'date-fns';
import { ClipboardService } from 'src/app/shared/services/clipboard/clipboard.service';
import { DefaultPlatformService } from 'src/app/shared/services/platform/default/default-platform.service';
import { ToastService } from 'src/app/shared/services/toast/toast.service';
import { Coin } from '../../wallets/shared-wallets/interfaces/coin.interface';
import { ApiWalletService } from '../../wallets/shared-wallets/services/api-wallet/api-wallet.service';
import { OperationKmInProgressModalComponent } from '../shared-ramps/components/operation-km-in-progress-modal/operation-km-in-progress-modal.component';
import { OperationDataInterface } from '../shared-ramps/interfaces/operation-data.interface';
import { FiatRampsService } from '../shared-ramps/services/fiat-ramps.service';
import { StorageOperationService } from '../shared-ramps/services/operation/storage-operation.service';
import { KriptonStorageService } from '../shared-ramps/services/kripton-storage/kripton-storage.service';
import { SUCCESS_TYPES } from 'src/app/shared/components/success-content/success-types.constant';
import { SimplifiedWallet } from '../../wallets/shared-wallets/models/simplified-wallet/simplified-wallet';
import { IonicStorageService } from '../../../shared/services/ionic-storage/ionic-storage.service';


@Component({
  selector: 'app-purchase-order',
  template: `
    <ion-header>
      <ion-toolbar mode="ios" color="primary" class="ux_toolbar ux_toolbar__left no-border">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="" (click)="navigateBack()"></ion-back-button>
        </ion-buttons>
        <ion-title class="po__header">
          {{ 'fiat_ramps.purchase_order.header' | translate }}
        </ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content *ngIf="this.data" class="po">
      <div class="po__provider">
        <ion-text class="ux-font-text-xxs">{{ 'fiat_ramps.purchase_order.provider' | translate }}</ion-text>
      </div>
      <div class="po__title" *ngIf="this.isFirstStep">
        <ion-text class="po__title__primary ux-font-text-xl">
          {{ 'fiat_ramps.purchase_order.title' | translate }}
        </ion-text>
        <ion-text class="po__title__subtitle ux-font-text-black">
          {{ 'fiat_ramps.purchase_order.subtitle' | translate }}
        </ion-text>
      </div>
      <div class="po__title" *ngIf="!this.isFirstStep">
        <ion-text class="po__title__primary ux-font-text-xl">
          {{ 'fiat_ramps.purchase_order.title_2' | translate }}
        </ion-text>
      </div>

      <app-voucher-card
        *ngIf="!this.isFirstStep"
        [voucher]="this.voucher"
        [percentage]="this.percentage"
        (addPhoto)="this.addPhoto()"
        (removePhoto)="this.removePhoto()"
      ></app-voucher-card>
      <app-kripton-account-info-card
        *ngIf="this.isFirstStep && !this.isLoading"
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
      <ion-button
        *ngIf="this.percentage !== 100 && this.step !== 2"
        name="Continue"
        expand="block"
        size="large"
        class="ux_button"
        color="secondary"
        (click)="this.goToNextStep()"
        >{{ 'fiat_ramps.purchase_order.button' | translate }}</ion-button
      >
      <ion-button
        *ngIf="this.step === 2"
        [disabled]="this.percentage !== 100 || this.disabledButtonToSend"
        appTrackClick
        name="ux_buy_kripton_send_invoice"
        expand="block"
        size="large"
        class="ux_button"
        color="secondary"
        (click)="this.sendPicture()"
        >{{ 'fiat_ramps.purchase_order.send_button' | translate }}</ion-button
      >
    </ion-footer>
  `,
  styleUrls: ['./purchase-order.page.scss'],
})
export class PurchaseOrderPage {
  isFirstStep: boolean;
  dDay: Date;
  data: OperationDataInterface;
  currencyOut: Coin;
  step: number;
  voucher: Photo;
  percentage = -1;
  filesystemPlugin = Filesystem;
  cameraPlugin = Camera;
  isSending = false;
  disabledButtonToSend = false;
  totalAmountIn: string;
  operationData: any;
  isLoading = false;

  constructor(
    private clipboardService: ClipboardService,
    private toastService: ToastService,
    private translate: TranslateService,
    private storageOperationService: StorageOperationService,
    private route: ActivatedRoute,
    private apiWalletService: ApiWalletService,
    private navController: NavController,
    private platformService: DefaultPlatformService,
    private fiatRampsService: FiatRampsService,
    private modalController: ModalController,
    private kriptonStorageService: KriptonStorageService,
    private storage: IonicStorageService
  ) {}

  async ionViewWillEnter() {
    this.getStep();
    this.getStorageOperationData();
    await this.getKriptonOperationData();
    this.getCurrencyOut();
    this.getOperationCreationDate();
  }

  private getCurrencyOut() {
    this.currencyOut = this.apiWalletService.getCoin(this.data.currency_out, this.data.network);
  }

  private getStep() {
    this.step = parseInt(this.route.snapshot.paramMap.get('step'));
    this.isFirstStep = this.step === 1;
  }

  private getOperationCreationDate() {
    const created_at = new Date(this.data.created_at);
    this.dDay = addHours(created_at, 72);
  }

  private getStorageOperationData() {
    this.data = this.storageOperationService.getData();
    this.voucher = this.storageOperationService.getVoucher();
  }

  private async getKriptonOperationData() {
    const email = await this.kriptonStorageService.get('email');
    const auth_token = await this.kriptonStorageService.get('access_token');
    this.operationData = await this.fiatRampsService
      .getUserSingleOperation(this.data.operation_id, { email: email, auth_token: auth_token })
      .toPromise();
    this.data.amount_in = this.operationData[0].amount_in;
    this.isLoading = false;
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
    this.navController.navigateForward(['/fiat-ramps/purchase-order/2'], { animated: false });
  }

  async addPhoto() {
    this.percentage = 0;
    const imageOptions: ImageOptions = {
      source: CameraSource.Prompt,
      saveToGallery: false,
      resultType: CameraResultType.DataUrl,
    };
    if (this.platformService.isNative()) {
      await this.filesystemPlugin.requestPermissions();
      await this.cameraPlugin.requestPermissions();
    } else {
      imageOptions.source = CameraSource.Photos;
    }
    try {
      const photo = await this.cameraPlugin.getPhoto(imageOptions);
      this.storageOperationService.updateVoucher(photo);
      this.voucher = this.storageOperationService.getVoucher();
      this.percentage = 100;
    } catch (error) {
      this.percentage = -1;
    }
  }

  disableButton(){
    this.disabledButtonToSend = true;
  }

  async sendPicture() {
    if (this.isSending) return;
    this.isSending = true;
    const email = await this.kriptonStorageService.get('email');
    const auth_token = await this.kriptonStorageService.get('access_token');
    const data = { file: this.voucher.dataUrl, email, auth_token };
    this.disableButton()
    this.fiatRampsService
      .confirmCashInOperation(this.data.operation_id, data)
      .toPromise()
      .then(async () => {
        this.data.voucher = true;
        if (!(await new SimplifiedWallet(this.storage).value())) {
          await this.openSuccessModal();
        } else {
          await this.navController.navigateRoot('/tabs/wallets');
        }
      })
      .catch(() => {
        this.goToError();
      })
      .finally(() => {
        this.storageOperationService.cleanVoucher();
        this.isSending = false;
      });
  }

  removePhoto() {
    this.storageOperationService.updateVoucher(undefined);
    this.voucher = undefined;
    this.percentage = -1;
  }

  goToError() {
    this.navController.navigateForward(['/fiat-ramps/error-operation-km']);
  }

  async openSuccessModal() {
    const modal = await this.modalController.create({
      component: OperationKmInProgressModalComponent,
      cssClass: 'modal',
      backdropDismiss: false,
      componentProps: {
        data: SUCCESS_TYPES.operation_km_in_progress,
      },
    });
    await modal.present();
  }

  navigateBack() {
    this.navController.back();
    if (this.isFirstStep) {
      this.storageOperationService.cleanVoucher();
    }
  }
}
