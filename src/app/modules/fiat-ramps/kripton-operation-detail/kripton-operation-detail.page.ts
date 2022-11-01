import { Component, OnInit } from '@angular/core';
import { Coin } from '../../wallets/shared-wallets/interfaces/coin.interface';
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
        <ion-card class="kod__card-container__card">
          <div class="kod__card-container__card__title">
            <ion-text class="ux-font-text-xl">
              {{ 'fiat_ramps.kripton_operation_detail.title' | translate }}
            </ion-text>
          </div>
    <!-- Network/icono -->
          <ion-item class="kod__card-container__card__coin">
            <div class="kod__card-container__card__coin__icon">
              <img [src]="'this.token.logoRoute'" alt="Token" />
            </div>
            <div class="kod__card-container__card__coin__content">
              <div class="kod__card-container__card__coin__content__name">
                <ion-text></ion-text>
              </div>
              <div class="kod__card-container__card__coin__content__network">
                <app-token-network-badge></app-token-network-badge>
              </div>
            </div>
            <div>
              <div>
                <ion-text> </ion-text>
              </div>
              <div>
                <ion-text> </ion-text>
              </div>
            </div>
          </ion-item>
          <!-- State -->
          <ion-item>
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
          <ion-item class="quotations">
            <div>
              <ion-text></ion-text>
            </div>
            <div>
              <ion-text></ion-text>
            </div>
          </ion-item>

          <!-- Destino -->
          <ion-item class="address">
            <div>
              <ion-text></ion-text>
            </div>
            <div>
              <ion-text></ion-text>
            </div>
          </ion-item>

          <!-- Proveedor -->
          <ion-item>
            
            </ion-item>

          <!-- Fecha/hora -->
          <ion-item>
            
            </ion-item>
        </ion-card>
      </div>
    </ion-content>
  `,
  styleUrls: ['./kripton-operation-detail.page.scss'],
})
export class KriptonOperationDetailPage implements OnInit {
  provider: FiatRampProvider;
  token: Coin;
  constructor() {}

  ngOnInit() {}

  ionViewWillEnter() {}
}
