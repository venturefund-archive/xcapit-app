import { Component, Input, OnInit } from '@angular/core';
import { Coin } from 'src/app/modules/wallets/shared-wallets/interfaces/coin.interface';
import { ApiWalletService } from 'src/app/modules/wallets/shared-wallets/services/api-wallet/api-wallet.service';
import { FiatRampOperation } from '../../interfaces/fiat-ramp-operation.interface';
import { FiatRampProvider } from '../../interfaces/fiat-ramp-provider.interface';
import { OperationStatus } from '../../interfaces/operation-status.interface';
import { FiatRampsService } from '../../services/fiat-ramps.service';

@Component({
  selector: 'app-operation-detail-card',
  template: `
    <ion-card class="ux-card odc ion-no-margin">
      <div class="odc__header">
        <div name="Coin Logo" class="odc__header__logo">
          <img [src]=" this.coin.logoRoute" alt="Coin Logo" />
        </div>
        <div name="Coin Name" class="odc__header__coin-name">
          <ion-text class="ux-font-text-lg">{{ this.coin.value.toUpperCase() }}</ion-text>
          <ion-text class="ux-font-text-base">{{ this.coin.name.split('-')[1] }}</ion-text>
        </div>
        <div class="odc__header__status-chip">
          <app-operation-status-chip [status]="this.operationStatus"></app-operation-status-chip>
        </div>
      </div>
      <div name="Operation" class="odc__detail">
        <div class="odc__detail__header">
          <ion-text class="ux-font-titulo-xs">{{ 'fiat_ramps.operation_detail.detail_card.operation' | translate }}</ion-text>
        </div>
        <div class="odc__detail__content">
          <div name="Operation Type">
            <ion-text class="ux-font-text-base">{{ 'fiat_ramps.operation_detail.detail_card.buy' | translate }}</ion-text>
          </div>
          <div name="Operation Type Detail" class="odc__detail__content__left">
            <ion-text class="ux-font-text-base">{{ this.operation.currency_out.toUpperCase() }} {{ 'fiat_ramps.operation_detail.detail_card.with' | translate }} {{ this.operation.currency_in.toUpperCase() }}</ion-text>
          </div>
        </div>
      </div>
      <div class="odc__detail">
        <div class="odc__detail__header">
          <ion-text class="ux-font-titulo-xs">{{ 'fiat_ramps.operation_detail.detail_card.amount' | translate }}</ion-text>
        </div>
        <div name="Amount" class="odc__detail__content">
          <ion-text class="ux-font-text-base">{{ this.operation.amount_in | number: '1.2-8' }} {{ this.operation.currency_in.toUpperCase() }}</ion-text>
        </div>
      </div>
      <div class="odc__detail">
        <div class="odc__detail__header">
          <ion-text class="ux-font-titulo-xs">{{ 'fiat_ramps.operation_detail.detail_card.quotation' | translate }}</ion-text>
        </div>
        <div name="Quotation" class="odc__detail__content">
          <ion-text class="ux-font-text-base">1 {{ this.operation.currency_out.toUpperCase() }} = {{ this.quoation | number: '1.2-8'  }} {{ this.operation.currency_in.toUpperCase() }}</ion-text>
        </div>
      </div>
      <div class="odc__detail">
        <div class="odc__detail__header">
          <ion-text class="ux-font-titulo-xs">{{ 'fiat_ramps.operation_detail.detail_card.provider' | translate }}</ion-text>
        </div>
        <div name="Provider" class="odc__detail__content">
          <ion-text class="ux-font-text-base">{{ this.provider.name }}</ion-text>
        </div>
      </div>
      <div class="odc__detail">
        <div class="odc__detail__header">
          <ion-text class="ux-font-titulo-xs">{{ 'fiat_ramps.operation_detail.detail_card.reception_address' | translate }}</ion-text>
        </div>
        <div name="Address" class="odc__detail__content">
          <ion-text class="ux-font-text-base">{{ this.operation.wallet_address }}</ion-text>
        </div>
      </div>
      <div class="odc__detail">
        <div class="odc__detail__header">
          <ion-text class="ux-font-titulo-xs">{{ 'fiat_ramps.operation_detail.detail_card.network' | translate }}</ion-text>
        </div>
        <div name="Network" class="odc__detail__content">
          <ion-text class="ux-font-text-base">{{ this.network | formattedNetwork }}</ion-text>
        </div>
      </div>
    </ion-card>
  `,
  styleUrls: ['./operation-detail-card.component.scss'],
})
export class OperationDetailCardComponent implements OnInit {
  @Input() operation: FiatRampOperation;
  @Input() provider: FiatRampProvider;
  coin: Coin;
  operationStatus: OperationStatus;
  network: string;
  quoation: number;

  constructor(
    private fiatRampsService: FiatRampsService,
    private apiWalletSertvice: ApiWalletService,
  ) {}

  ngOnInit() {
    this.operationStatus = this.fiatRampsService.getOperationStatus(this.operation.status, parseInt(this.operation.provider));
    this.coin = this.apiWalletSertvice.getCoin(this.operation.currency_out);
    this.network = this.coin.network;

    this.calculateQuotation();
  }

  private calculateQuotation() {
    this.quoation = this.operation.amount_in / this.operation.amount_out;
  }
}
