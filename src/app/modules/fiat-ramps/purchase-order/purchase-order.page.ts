import { Component, OnDestroy, OnInit } from '@angular/core';
import { addHours } from 'date-fns';
import { interval, Subscription } from 'rxjs';
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

      <!-- TODO: Hacer un componente de esto -->
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
      <!--  -->

      <div class="po__account">
        <ion-label class="po__account__title ux-font-text-lg">Transfiere a la siguiente cuenta</ion-label>
        <div class="po__account__details">
          <div class="po__account__details__amount">
            <img
              class="po__account__details__amount__country-flag"
              [src]="'/assets/img/purchase-order/' + this.data.country + '-flag.svg'"
            />
            <div class="po__account__details__amount__currency">
              <ion-label class="ux-font-header-titulo">{{ this.data.currency_in }}</ion-label>
              <ion-label class="ux-font-text-xs">Pesos Argentinos</ion-label>
            </div>
            <ion-label class="po__account__details__amount__value ux-font-header-titulo">$20.000,00</ion-label>
            <img src="/assets/img/purchase-order/copy.svg" />
          </div>
          <div class="po__account__details__item">
            <div class="po__account__details__item__data">
              <ion-label class="ux-font-titulo-xs">Alias</ion-label>
              <ion-label class="po__account__details__item__data__value ux-font-text-base">Kriptonmarket.ars</ion-label>
            </div>
            <img src="/assets/img/purchase-order/copy.svg" />
          </div>
          <div class="po__account__details__item">
            <div class="po__account__details__item__data">
              <ion-label class="ux-font-titulo-xs">CBU</ion-label>
              <ion-label class="po__account__details__item__data__value ux-font-text-base"
                >1500623500062332502528</ion-label
              >
            </div>
            <img src="/assets/img/purchase-order/copy.svg" />
          </div>
          <div class="po__account__details__item">
            <div class="po__account__details__item__data">
              <ion-label class="ux-font-titulo-xs">Titular</ion-label>
              <ion-label class="po__account__details__item__data__value ux-font-text-base">Kripton S.A.</ion-label>
            </div>
          </div>
        </div>
      </div>

      <div class="po__buy">
        <ion-label class="po__buy__title ux-font-text-lg">Tu compra</ion-label>
        <ion-accordion-group class="po__buy__accordion-group">
          <ion-accordion class="po__buy__accordion-group__accordion accordion-arrow-info" value="first">
            <ion-item class="po__buy__accordion-group__accordion__item" slot="header">
              <div class="po__buy__accordion-group__accordion__item__header">
                <img src="assets/img/coins/USDC.png" />
                <div class="po__buy__accordion-group__accordion__item__header__coin">
                  <ion-label
                    class="po__buy__accordion-group__accordion__item__header__coin__value ux-font-header-titulo"
                    >USDC</ion-label
                  >
                  <ion-label
                    class="po__buy__accordion-group__accordion__item__header__coin__network ux-font-num-subtitulo"
                    >POLYGON</ion-label
                  >
                </div>
                <ion-label class="po__buy__accordion-group__accordion__item__header__value ux-font-header-titulo"
                  >100 USDC</ion-label
                >
              </div>
            </ion-item>
            <div class="po__buy__accordion-group__accordion__item__content ion-padding" slot="content">
              <div class="po__buy__accordion-group__accordion__item__content__data">
                <ion-label class="ux-font-titulo-xs">Cotización</ion-label>
                <ion-label class="po__buy__accordion-group__accordion__item__content__data__value ux-font-text-base">1 USDC = 280 ARS</ion-label>
              </div>
              <div class="po__buy__accordion-group__accordion__item__content__data">
                <ion-label class="ux-font-titulo-xs">Operación</ion-label>
                <ion-label class="po__buy__accordion-group__accordion__item__content__data__value ux-font-text-base">N° 3456</ion-label>
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
    // amount_in: this.form.value.fiatAmount,
    // amount_out: this.form.value.cryptoAmount,
    currency_in: 'ARS',
    // currency_out: this.selectedCurrency.value,
    // price_in: '1',
    // price_out: this.fiatPrice.toString(),
    // wallet: await this.walletAddress(),
    // provider: this.provider.id.toString(),
    // network: this.selectedCurrency.network,
  };
  public timeDifference;
  public minutesToDday;
  public hoursToDday;
  constructor() {}

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
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
