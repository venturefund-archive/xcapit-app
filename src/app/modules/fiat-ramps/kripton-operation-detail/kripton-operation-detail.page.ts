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
          {{ 'fiat_ramps.operation_detail.header' | translate }}
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
                <ion-text class="ux-font-text-lg">{{ this.operation.amount_out }} {{ this.operation.currency_out }}</ion-text>
              </div>
              <div class="kod__card-container__card__amount__in">
                <ion-text class="ux-font-text-xs">= {{ this.operation.amount_in }} {{ this.operation.currency_in }}</ion-text>
              </div>
            </div>
          </ion-item>
          <!-- State -->
          <ion-item class="ion-no-margin ion-no-padding">
            <div>
              <ion-text>

              </ion-text>
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
                {{this.operation.amount_in/this.operation.amount_out}}
              </ion-text>
            </div>
            </div>
            
          </ion-item>

          <!-- Destino -->
          <ion-item class="ion-no-margin ion-no-padding">
            <div>
              <ion-text></ion-text>
            </div>
            <div>
              <ion-text></ion-text>
            </div>
          </ion-item>

          <!-- Proveedor -->
          <ion-item class="ion-no-margin ion-no-padding">
            
            </ion-item>

          <!-- Fecha/hora -->
          <ion-item class="ion-no-margin ion-no-padding" lines="none">
            
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
