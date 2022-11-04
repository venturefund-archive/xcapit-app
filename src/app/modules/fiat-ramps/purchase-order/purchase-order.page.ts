import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { addHours } from 'date-fns';
import { interval, Subscription } from 'rxjs';
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
        <ion-title>
          {{ 'fiat_ramps.user_email.header' | translate }}
        </ion-title>
        <ion-label class="ux-font-text-xs step_counter" slot="end"
          >1 {{ 'shared.step_counter.of' | translate }} 2</ion-label
        >
      </ion-toolbar>
    </ion-header>
    <ion-content class="po">
      <div class="po__provider">
        <ion-text class="ux-font-text-xxs">{{ 'fiat_ramps.user_email.provider' | translate }}</ion-text>
      </div>

      <div class="po__step-wrapper">
        <div class="po__step-wrapper__step active">
          <div class="po__step-wrapper__step__number number first">
            <ion-label *ngIf="!this.completed" class="ux-font-text-lg ">1</ion-label>
            <ion-icon *ngIf="this.completed" name="check-circle"></ion-icon>
          </div>
          <ion-label class="po__step-wrapper__step__title title ux-font-titulo-xs">Transferir</ion-label>
        </div>
        <div class="po__step-wrapper__step inactive">
          <div class="po__step-wrapper__step__number number">
            <ion-label class="ux-font-text-lg">2</ion-label>
          </div>
          <ion-label class="po__step-wrapper__step__title title ux-font-titulo-xs">Cargar comprobante</ion-label>
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
      <ion-label class="ux-font-text-xs"
        ><ion-icon name="clock"></ion-icon>Te quedan {{ hoursToDday }}:{{ minutesToDday }} para transferir</ion-label
      >
      <ion-button expand="block" size="large" class="ux_button" color="secondary">Continuar</ion-button>
    </ion-footer> `,
  styleUrls: ['./purchase-order.page.scss'],
})
export class PurchaseOrderPage implements OnInit, OnDestroy {
  completed = false;
  private subscription: Subscription;

  public dateNow = new Date();
  public dDay = addHours(new Date(), 72);
  milliSecondsInASecond = 1000;
  hoursInADay = 24;
  minutesInAnHour = 60;
  SecondsInAMinute = 60;
  data: OperationDataInterface;
  amountIn: number;
  public timeDifference;
  public minutesToDday;
  public hoursToDday;
  constructor(private clipboardService: ClipboardService, private toastService: ToastService, private translate: TranslateService, private storageOperationService: StorageOperationService,) {}

  ngOnInit() {
    this.getData();
    this.subscription = interval(1000).subscribe((x) => {
      this.getTimeDifference();
    });
  }

  getData(){
    this.data = {
      amount_in: '7274.994150004679',
      amount_out: '20.20833325',
      country: "Argentina",
      currency_in: "ars",
      currency_out: "MATIC",
      network: "MATIC",
      price_in: "1",
      operation_id: 676,
      price_out: "359.9997120002304",
      provider: "1",
      type: "cash-in",
      wallet: "0xd148c6735e1777be439519b32a1a6ef9c8853934"
    }
    
    console.log(this.data);
  }

  private getTimeDifference() {
    this.timeDifference = this.dDay.getTime() - new Date().getTime();
    this.allocateTimeUnits(this.timeDifference);
  }

  private allocateTimeUnits(timeDifference) {
    this.minutesToDday = Math.floor(
      (timeDifference / (this.milliSecondsInASecond * this.minutesInAnHour)) % this.SecondsInAMinute
    );
    this.hoursToDday = Math.floor(
      timeDifference / (this.milliSecondsInASecond * this.minutesInAnHour * this.SecondsInAMinute)
    );
  }

  copyToClipboard(clipboardInfo) {
    this.clipboardService.write({ string: clipboardInfo.value }).then(
      () => {
        this.showToastOf(clipboardInfo.modalText);
      },
    );
  }

  private showToastOf(modalText) {
    this.toastService.showInfoToast({
      message: this.translate.instant('fiat_ramps.purchase_order.clipboard_text', { type: this.translate.instant(modalText) }),
    });
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
