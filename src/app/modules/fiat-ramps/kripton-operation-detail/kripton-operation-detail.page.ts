import { Component, OnInit } from '@angular/core';
import { NONPROD_COINS } from '../../wallets/shared-wallets/constants/coins.nonprod';
import { Coin } from '../../wallets/shared-wallets/interfaces/coin.interface';
import { FiatRampOperation } from '../shared-ramps/interfaces/fiat-ramp-operation.interface';
import { FiatRampProvider } from '../shared-ramps/interfaces/fiat-ramp-provider.interface';

@Component({
  selector: 'app-kripton-operation-detail',
  template: `
    <ion-header>
      <ion-toolbar mode="ios" color="primary" class="ux_toolbar">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/fiat-ramps/purchases"></ion-back-button>
        </ion-buttons>
        <ion-title>
          {{ 'fiat_ramps.kripton_operation_detail.header' | translate }}
        </ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding kod">
      <div class="kod__card-container">
        <ion-card class="kod__card-container__card ux-card-new ion-no-margin" *ngIf="this.operation">
          <div class="kod__card-container__card__title">
            <ion-text class="ux-font-text-xl">
              {{ 'fiat_ramps.kripton_operation_detail.title' | translate }}
            </ion-text>
          </div>
          <!-- Network/icono -->
          <ion-item class="kod__card-container__card__coin ion-no-margin ion-no-padding">
            <div class="kod__card-container__card__coin__icon">
              <img [src]="this.token.logoRoute" alt="Token" />
            </div>
            <div class="kod__card-container__card__coin__content">
              <div class="kod__card-container__card__coin__content__name">
                <ion-text class="ux-font-text-lg">{{ this.token.value }}</ion-text>
              </div>
              <div class="kod__card-container__card__coin__content__network">
                <app-token-network-badge [blockchainName]="this.token.network"></app-token-network-badge>
              </div>
            </div>
            <div class="kod__card-container__card__amount">
              <div class="kod__card-container__card__amount__out">
                <ion-text class="ux-font-text-lg"
                  >{{ this.operation.amount_out }} {{ this.operation.currency_out }}</ion-text
                >
              </div>
              <div class="kod__card-container__card__amount__in">
                <ion-text class="ux-font-text-xs"
                  >= {{ this.operation.amount_in }} {{ this.operation.currency_in }}</ion-text
                >
              </div>
            </div>
          </ion-item>
          <!-- State -->
          <ion-item class="ion-no-margin ion-no-padding">
            <div>
              <ion-text> </ion-text>
              <ion-button><ion-icon></ion-icon></ion-button>
            </div>
            <div>
              <ion-badge></ion-badge>
            </div>
          </ion-item>
          <!-- Cotizacion/icono -->
          <ion-item class="kod__card-container__card__quotation ion-no-margin ion-no-padding">
            <div class="kod__card-container__card__quotation__container">
              <div class="kod__card-container__card__quotation__container__title">
                <ion-text class="ux-font-titulo-xs">
                  {{ 'fiat_ramps.kripton_operation_detail.quotation' | translate }}
                </ion-text>
              </div>
              <div class="kod__card-container__card__quotation__container__content">
                <ion-text class="ux-font-text-base">
                  1 {{ this.operation.currency_out }} = {{ this.operation.amount_in / this.operation.amount_out }}
                  {{ this.operation.currency_in }}
                </ion-text>
              </div>
            </div>
          </ion-item>

          <!-- Destino -->
          <ion-item class="kod__card-container__card__address ion-no-margin ion-no-padding">
            <div class="kod__card-container__card__address__container">
              <div class="kod__card-container__card__address__container__title">
                <ion-text class="ux-font-titulo-xs">
                  {{ 'fiat_ramps.kripton_operation_detail.address' | translate }}
                </ion-text>
              </div>
              <div class="kod__card-container__card__address__container__content">
                <ion-text class="ux-font-text-base">
                  {{ this.wallet.address }}
                </ion-text>
              </div>
            </div>
          </ion-item>

          <!-- Proveedor -->
          <ion-item class="kod__card-container__card__provider ion-no-margin ion-no-padding">
            <div class="kod__card-container__card__provider__container">
              <div class="kod__card-container__card__provider__container__provider">
                <div class="kod__card-container__card__provider__container__provider__title">
                  <ion-text class="ux-font-titulo-xs">
                    <!-- {{ 'fiat_ramps.kripton_operation_detail.address' | translate }} -->
                    Provider
                  </ion-text>
                </div>
                <div class="kod__card-container__card__provider__container__provider__content">
                  <img src="assets/img/provider-logos/KriptonMarket.svg" />

                  <ion-text class="ux-font-text-base"> Kripton Market </ion-text>
                </div>
              </div>
              <div class="kod__card-container__card__provider__container__operation">
                <div class="kod__card-container__card__provider__container__operation__title">
                  <ion-text class="ux-font-titulo-xs">
                    {{ 'fiat_ramps.kripton_operation_detail.operation' | translate }}
                  </ion-text>
                </div>
                <div class="kod__card-container__card__provider__container__operation__content">
                  <ion-text class="ux-font-text-base">
                    {{ this.operation.operation_id }}
                  </ion-text>
                </div>
              </div>
            </div>
          </ion-item>

          <!-- Fecha/hora -->
          <ion-item class="kod__card-container__card__date ion-no-margin ion-no-padding" lines="none">
            <div class="kod__card-container__card__date__container">
              <div class="kod__card-container__card__date__container__date">
                <div class="kod__card-container__card__date__container__date__title">
                  <ion-text class="ux-font-titulo-xs">
                    {{ 'fiat_ramps.kripton_operation_detail.date' | translate }}
                  </ion-text>
                </div>
                <div class="kod__card-container__card__date__container__date__content">
                  <ion-text class="ux-font-text-base">
                    {{ this.operation.created_at | date: 'dd/MM/YYYY' }}
                  </ion-text>
                </div>
              </div>
              <div class="kod__card-container__card__date__container__hour">
                <div class="kod__card-container__card__date__container__hour__content">
                  <ion-text class="ux-font-text-base">
                    {{ this.operation.created_at | date: 'HH:mm'
                    }}{{ 'fiat_ramps.kripton_operation_detail.hours' | translate }}
                  </ion-text>
                </div>
              </div>
            </div>
          </ion-item>
        </ion-card>
      </div>
    </ion-content>
  `,
  styleUrls: ['./kripton-operation-detail.page.scss'],
})
export class KriptonOperationDetailPage implements OnInit {
  provider: FiatRampProvider;
  operation: FiatRampOperation;
  token: Coin = NONPROD_COINS[0];
  wallet = {
    address: '0xeeeeeeeeeeeeeee',
  };
  constructor() {}

  ngOnInit() {}

  ionViewWillEnter() {
    // TODO: change this
    this.operation = {
      operation_id: 678,
      operation_type: 'cash-in',
      status: 'cancel',
      currency_in: 'ARS',
      amount_in: 500.0,
      currency_out: 'USDT',
      amount_out: 100.0,
      created_at: new Date('2021-02-27T10:02:49.719Z'),
      provider: '1',
      voucher: false,
    };
  }
}
