import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { addHours } from 'date-fns';
import { interval, Subscription } from 'rxjs';
import { ClipboardService } from 'src/app/shared/services/clipboard/clipboard.service';
import { ToastService } from 'src/app/shared/services/toast/toast.service';
import { OperationDataInterface } from '../shared-ramps/interfaces/operation-data.interface';

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
        [country]="this.data.country"
        [amount]="this.data.amount_in"
        [currency]="this.data.currency_in"
        (copyValue)="this.copyToClipboard($event)"
      ></app-kripton-account-info-card>

      <div class="po__buy">
        <ion-label class="po__buy__title ux-font-text-lg">Tu compra</ion-label>
        <ion-accordion-group class="po__buy__accordion-group">
          <ion-accordion class="po__buy__accordion-group__accordion accordion-arrow-info" value="first">
            <ion-item class="po__buy__accordion-group__accordion__item" slot="header">
              <div class="po__buy__accordion-group__accordion__item__header">
                <img [src]="'assets/img/coins/' + this.data.currency_out + '.png'" />
                <div class="po__buy__accordion-group__accordion__item__header__coin">
                  <ion-label
                    class="po__buy__accordion-group__accordion__item__header__coin__value ux-font-header-titulo"
                    >{{ this.data.currency_out }}</ion-label
                  >
                  <app-token-network-badge blockchainName="MATIC"></app-token-network-badge>
                </div>
                <ion-label class="po__buy__accordion-group__accordion__item__header__value ux-font-header-titulo"
                  >100 {{ this.data.currency_out }}</ion-label
                >
              </div>
            </ion-item>
            <div class="po__buy__accordion-group__accordion__item__content ion-padding" slot="content">
              <div class="po__buy__accordion-group__accordion__item__content__data">
                <ion-label class="ux-font-titulo-xs">Cotización</ion-label>
                <ion-label class="po__buy__accordion-group__accordion__item__content__data__value ux-font-text-base"
                  >1 USDC = 280 ARS</ion-label
                >
              </div>
              <div class="po__buy__accordion-group__accordion__item__content__data">
                <ion-label class="ux-font-titulo-xs">Operación</ion-label>
                <ion-label class="po__buy__accordion-group__accordion__item__content__data__value ux-font-text-base"
                  >N° 3456</ion-label
                >
              </div>
            </div>
          </ion-accordion>
        </ion-accordion-group>
      </div>
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
  data: Partial<OperationDataInterface> = {
    country: 'arg',
    // type: 'cash-in',
    amount_in: '200000',
    // amount_out: this.form.value.cryptoAmount,
    currency_in: 'ARS',
    currency_out: 'USDC',
    // price_in: '1',
    // price_out: this.fiatPrice.toString(),
    // wallet: await this.walletAddress(),
    // provider: this.provider.id.toString(),
    // network: this.selectedCurrency.network,
  };
  public timeDifference;
  public minutesToDday;
  public hoursToDday;
  constructor(private clipboardService: ClipboardService, private toastService: ToastService, private translate: TranslateService) {}

  ngOnInit() {
    this.subscription = interval(1000).subscribe((x) => {
      this.getTimeDifference();
    });
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
