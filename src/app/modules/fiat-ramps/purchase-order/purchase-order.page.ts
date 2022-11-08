import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { addHours } from 'date-fns';
import { ClipboardService } from 'src/app/shared/services/clipboard/clipboard.service';
import { ToastService } from 'src/app/shared/services/toast/toast.service';
import { OperationDataInterface } from '../shared-ramps/interfaces/operation-data.interface';
import { StorageOperationService } from '../shared-ramps/services/operation/storage-operation.service';

@Component({
  selector: 'app-purchase-order',
  template: `<ion-header>
      <ion-toolbar mode="ios" color="primary" class="ux_toolbar ux_toolbar__left no-border">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/fiat-ramps/new-operation/kripton"></ion-back-button>
        </ion-buttons>
        <ion-title class="po__header">
          {{ 'fiat_ramps.purchase_order.header' | translate }}
        </ion-title>
        <ion-label class="ux-font-text-xs step_counter" slot="end"
          >1 {{ 'shared.step_counter.of' | translate }} 2</ion-label
        >
      </ion-toolbar>
    </ion-header>
    <ion-content *ngIf="this.data" class="po">
      <div class="po__provider">
        <ion-text class="ux-font-text-xxs">{{ 'fiat_ramps.purchase_order.provider' | translate }}</ion-text>
      </div>

      <div class="po__step-wrapper">
        <div class="po__step-wrapper__step active">
          <div class="po__step-wrapper__step__number number first">
            <ion-label *ngIf="!this.completed" class="ux-font-text-lg">1</ion-label>
            <ion-icon *ngIf="this.completed" name="check-circle"></ion-icon>
          </div>
          <ion-label class="po__step-wrapper__step__title title ux-font-titulo-xs">{{
            'fiat_ramps.purchase_order.step_1' | translate
          }}</ion-label>
        </div>
        <div class="po__step-wrapper__step inactive">
          <div class="po__step-wrapper__step__number number">
            <ion-label class="ux-font-text-lg">2</ion-label>
          </div>
          <ion-label class="po__step-wrapper__step__title title ux-font-titulo-xs">{{
            'fiat_ramps.purchase_order.step_2' | translate
          }}</ion-label>
        </div>
      </div>
      <app-kripton-account-info-card
        [country]="this.data.country.toLowerCase()"
        [amount]="this.data.amount_in"
        [currency]="this.data.currency_in.toUpperCase()"
        (copyValue)="this.copyToClipboard($event)"
      ></app-kripton-account-info-card>
      <app-kripton-purchase-info
        [network]="this.data.network"
        [currencyOut]="this.data.currency_out"
        [currencyIn]="this.data.currency_in"
        [priceOut]="this.data.price_out"
        [operationId]="this.data.operation_id"
        [amountOut]="this.data.amount_out"
      ></app-kripton-purchase-info>
    </ion-content>
    <ion-footer class="po__footer ion-padding ux_footer">
      <app-timer-countdown text="fiat_ramps.purchase_order.timer" [deadlineDate]="dDay"></app-timer-countdown>
      <ion-button expand="block" size="large" class="ux_button" color="secondary">{{
        'fiat_ramps.purchase_order.button' | translate
      }}</ion-button>
    </ion-footer> `,
  styleUrls: ['./purchase-order.page.scss'],
})
export class PurchaseOrderPage implements OnInit {
  completed = false;
  dDay = addHours(new Date(), 72);
  data: OperationDataInterface;
  amountIn: number;
  constructor(
    private clipboardService: ClipboardService,
    private toastService: ToastService,
    private translate: TranslateService,
    private storageOperationService: StorageOperationService
  ) {}

  ngOnInit() {}
  ionViewWillEnter() {
    this.getData();
  }

  getData() {
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
}
