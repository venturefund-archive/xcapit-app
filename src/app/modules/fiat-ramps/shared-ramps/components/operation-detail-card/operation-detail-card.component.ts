import { Component, Input, OnInit } from '@angular/core';
import { NONPROD_COINS } from 'src/app/modules/wallets/shared-wallets/constants/coins.nonprod';
import { Coin } from 'src/app/modules/wallets/shared-wallets/interfaces/coin.interface';
import { OPERATION_STATUS } from '../../constants/operation-status';
import { FiatRampOperation } from '../../interfaces/fiat-ramp-operation.interface';
import { OperationStatus } from '../../interfaces/operation-status.interface';

@Component({
  selector: 'app-operation-detail-card',
  template: `
    <ion-card class="ux-card odc">
      <div class="odc__header">
        <div class="odc__header__logo">
          <img [src]="'assets/img/coins/' + this.coin.value.toUpperCase() + '.svg'" alt="Coin Logo" />
        </div>
        <div class="odc__header__coin-name">
          <ion-text class="ux-font-text-lg">{{ this.coin.value.toUpperCase() }}</ion-text>
          <ion-text class="ux-font-text-base">{{ this.coin.name.split('-')[1] }}</ion-text>
        </div>
        <div class="odc__header__status-chip">
          <app-operation-status-chip [status]="this.operationStatus"></app-operation-status-chip>
        </div>
      </div>
      <div class="odc__detail">
        <div class="odc__detail__header">
          <ion-text>Operacion</ion-text>
        </div>
        <div class="odc__detail__content">
          <div>
            <ion-text class="ux-font-text-base">Tipo</ion-text>
          </div>
          <div>
            <ion-text class="ux-font-text-base">ARS con USDT</ion-text>
          </div>
        </div>
      </div>
      <div class="odc__detail">
        <div class="odc__detail__header">
          <ion-text>Monto</ion-text>
        </div>
        <div class="odc__detail__content">
          <ion-text class="ux-font-text-base">123123 asr</ion-text>
        </div>
      </div>
      <div class="odc__detail">
        <div class="odc__detail__header">
          <ion-text class="ux-font-titulo-xs">Cotizacion</ion-text>
        </div>
        <div class="odc__detail__content">
          <ion-text class="ux-font-text-base">1 USDT = 200 ARS</ion-text>
        </div>
      </div>
      <div class="odc__detail">
        <div class="odc__detail__header">
          <ion-text class="ux-font-titulo-xs">Proveedor</ion-text>
        </div>
        <div class="odc__detail__content">
          <ion-text class="ux-font-text-base">Kripton Market</ion-text>
        </div>
      </div>
      <div class="odc__detail">
        <div class="odc__detail__header">
          <ion-text class="ux-font-titulo-xs">Direccion de recepcion</ion-text>
        </div>
        <div class="odc__detail__content">
          <ion-text class="ux-font-text-base">0x0000000</ion-text>
        </div>
      </div>
      <div class="odc__detail">
        <div class="odc__detail__header">
          <ion-text class="ux-font-titulo-xs">Red</ion-text>
        </div>
        <div class="odc__detail__content">
          <ion-text class="ux-font-text-base">Polygonwannaland</ion-text>
        </div>
      </div>
    </ion-card>
  `,
  styleUrls: ['./operation-detail-card.component.scss'],
})
export class OperationDetailCardComponent implements OnInit {
  @Input() operation: FiatRampOperation;
  coin: Coin = NONPROD_COINS[0];
  address: string;
  operationStatus: OperationStatus = OPERATION_STATUS[0];

  constructor() {}

  ngOnInit() {}

  ionViewWillEnter() {}
}
