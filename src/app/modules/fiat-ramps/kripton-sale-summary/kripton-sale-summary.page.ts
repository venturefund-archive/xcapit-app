import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-kripton-sale-summary',
  template: `<ion-header>
      <ion-toolbar mode="ios" color="primary" class="ux_toolbar">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/fiat-ramps/purchases"></ion-back-button>
        </ion-buttons>
        <ion-title>
          {{ 'fiat_ramps.kripton_sale_summary.header' | translate }}
        </ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding kss">
      <div class="kss__card-container">
        <ion-card class="kss__card-container__card ux-card-new ion-no-margin no-border">
          <div class="kss__card-container__card__title">
            <ion-text class="ux-font-text-xl">
              {{ 'fiat_ramps.kripton_sale_summary.title' | translate }}
            </ion-text>
          </div>
          <div class="kss__card-container__card__coin-content">
            <app-coin-content-item
              [logoRoute]="'assets/img/fiat-ramps/kripton-sale-summary/argentina.svg'"
              [country]="'ARS'"
              [network]="this.token.network"
              [amount]="10000"
              [quoteAmount]="1.2"
              [token]="this.token.value"
            ></app-coin-content-item>
          </div>
          <div class="list-divider"></div>
          <div class="kss__card-container__card__quote">
            <div class="kss__card-container__card__quote__title">
              <ion-text class="ux-font-titulo-xs">{{'fiat_ramps.kripton_sale_summary.quote' | translate}}</ion-text>
            </div>
            <div class="kss__card-container__card__quote__description">
              <ion-text class="ux-font-text-base">1 USDC = 370 ARS</ion-text>
            </div>
          </div>
          <div class="list-divider"></div>
          <div class="kss__card-container__card__transaction-fee">
            <div class="kss__card-container__card__transaction-fee__title">
              <ion-text class="ux-font-titulo-xs">{{'fiat_ramps.kripton_sale_summary.transaction_fee' | translate}}</ion-text>
            </div>
            <div class="kss__card-container__card__transaction-fee__description">
              <ion-text class="ux-font-text-base">5 USDC</ion-text>
            </div>
          </div>
          <div class="list-divider"></div>
          <div class="kss__card-container__card__provider-fee">
            <div class="kss__card-container__card__provider-fee__title">
              <ion-text class="ux-font-titulo-xs">{{'fiat_ramps.kripton_sale_summary.provider_fee' | translate}}</ion-text>
            </div>
            <div class="kss__card-container__card__provider-fee__description">
              <ion-text class="ux-font-text-base">2 USDC</ion-text>
            </div>
          </div>
          <div class="list-divider"></div>
          <div class="kss__card-container__card__wallet">
            <div class="kss__card-container__card__wallet__title">
              <ion-text class="ux-font-titulo-xs">{{'fiat_ramps.kripton_sale_summary.wallet' | translate}}</ion-text>
            </div>
            <div class="kss__card-container__card__wallet__description">
              <ion-text class="ux-font-text-base">1GR75NstyyLrtuR...NN89Ug5QkK87c2</ion-text>
            </div>
          </div>
          <div class="list-divider"></div>
          <div class="kss__card-container__card__bank-account">
            <div class="kss__card-container__card__bank-account__title">
              <ion-text class="ux-font-titulo-xs">{{'fiat_ramps.kripton_sale_summary.bank_account' | translate}}</ion-text>
            </div>
            <div class="kss__card-container__card__bank-account__description">
              <ion-text class="ux-font-text-base">02420340222034234234010</ion-text>
            </div>
          </div>
          <div class="list-divider"></div>
          <div class="kss__card-container__card__provider">
            <div class="kss__card-container__card__provider__title">
              <ion-text class="ux-font-titulo-xs">{{'fiat_ramps.kripton_sale_summary.provider' | translate}}</ion-text>
            </div>
            <div class="kss__card-container__card__provider__description">
              <img src="assets/img/provider-logos/KriptonMarket.svg" />
              <ion-text class="ux-font-text-base">Kripton Market</ion-text>
            </div>
          </div>
          <div class="list-divider"></div>
          <div class="kss__card-container__card__date">
            <div class="kss__card-container__card__date__title">
              <ion-text class="ux-font-titulo-xs">{{'fiat_ramps.kripton_sale_summary.date' | translate}}</ion-text>
            </div>
            <div class="kss__card-container__card__date__description">
            <div class="kss__card-container__card__date__description__date">
              <ion-text class="ux-font-text-base">17/05/2022</ion-text>
            </div>
            <div class="kss__card-container__card__date__description__hour">
              <ion-text class="ux-font-text-base">21:30hs</ion-text>
            </div>
            </div>
          </div>
        </ion-card>
      </div>
    </ion-content>
    <ion-footer class="kss__footer">
      <div class="kss__footer__submit-button ion-padding">
        <ion-button
          class="ux_button"
          color="secondary"
          appTrackClick
          name="ux_sell_send_confirm"
          
          >{{ 'fiat_ramps.kripton_sale_summary.button' | translate }}
        </ion-button>
      </div>
    </ion-footer>`,
  styleUrls: ['./kripton-sale-summary.page.scss'],
})
export class KriptonSaleSummaryPage implements OnInit {
  token = {
    network: 'MATIC',
    value: 'USDC',
    logoRoute: 'assets/img/coins/USDC-POLYGON.svg',
  };
  constructor() {}

  ngOnInit() {}
}
