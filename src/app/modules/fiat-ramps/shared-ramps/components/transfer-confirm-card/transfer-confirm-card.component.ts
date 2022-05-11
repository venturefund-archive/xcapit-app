import { Component, Input, OnInit } from '@angular/core';
import { NETWORK_COLORS } from 'src/app/modules/wallets/shared-wallets/constants/network-colors.constant';
import { Coin } from 'src/app/modules/wallets/shared-wallets/interfaces/coin.interface';
import { OperationDataInterface } from '../../services/operation/storage-operation.service';

@Component({
  selector: 'app-transfer-confirm-card',
  template: `
        <app-ux-loading-block *ngIf="!this.operationData" minSize="30px"></app-ux-loading-block>
          <div class="tcc__card ion-padding ux-card-new" *ngIf="this.operationData">
            <div class="tcc__card__name-and-icon">
              <div class="tcc__card__name-and-icon__icon">
                <img [src]="this.token.logoRoute" alt="Token" />
              </div>
              <div class="tcc__card__name-and-icon__name ux-font-text-base-black">
                {{ this.token.name }}
              </div>  
            </div>

            <div class="tcc__card__operation">
              <div class="tcc__card__operation__title">
                <ion-text class="ux-font-titulo-xs">{{ 'fiat_ramps.confirm.type' | translate }}</ion-text>
              </div>

              <div class="tcc__card__operation__content" *ngIf="this.operationData.type === 'cash-in'">
                <ion-text class="ux-font-text-base-black">
                  {{ 'fiat_ramps.confirm.buy.operationType' | translate }}
                </ion-text>
                <ion-text float-right class="ux-font-text-base-black">
                    {{ this.operationData.currency_out | uppercase }}
                    {{ 'fiat_ramps.confirm.buy.with' | translate }} {{ this.operationData.currency_in | uppercase }}
                </ion-text>
              </div>
            </div>

            <div class="tcc__card__amount">
              <div class="tcc__card__amount__title ux-font-titulo-xs">
                <ion-text> {{ 'fiat_ramps.confirm.amount' | translate }}</ion-text>
              </div>
              <div class="tcc__card__amount__content">
                <ion-text class="ux-font-text-base-black"> {{ this.operationData.amount_in }} {{ this.operationData.currency_in }} </ion-text>
              </div>
            </div>

            <div class="tcc__card__quotation">
              <div class="tcc__card__quotation__title">
                <div class="tcc__card__quotation__title ux-font-titulo-xs">
                  <ion-text> {{ 'fiat_ramps.confirm.quotation' | translate }} </ion-text>
                </div>
              </div>
              <div class="tcc__card__quotation__content">
              <ion-text class="ux-font-text-base-black">
                {{ this.operationData.price_in }}
                {{ this.operationData.currency_out }} =
                {{ this.operationData.price_out }}
                {{ this.operationData.currency_in }}
              </ion-text>
              </div>
            </div>
            <div class="tcc__card__provider">
              <div class="tcc__card__provider__title ux-font-titulo-xs">
                <ion-text>{{'fiat_ramps.confirm.provider' | translate }}</ion-text>
              </div>
              <div class="tcc__card__provider__content">
                <ion-text class="ux-font-text-base-black">
                  {{ this.provider.name }}
                </ion-text>
              </div>
            </div>

            <div class="tcc__card__address-dst">
              <div class="tcc__card__address-dst__title ux-font-titulo-xs">
                <ion-text>{{'fiat_ramps.confirm.wallet' | translate }}</ion-text>
              </div>
              <div class="tcc__card__address-dst__content">
                <ion-text class="ux-font-text-base-black">
                  {{ this.operationData.wallet }}
                </ion-text>
              </div>
            </div>
            <div class="tcc__card__network">
              <div class="tcc__card__network__title ux-font-titulo-xs">
                <ion-text>{{'fiat_ramps.confirm.network' | translate }}</ion-text>
              </div>
              <div class="tcc__card_network__content">
                <ion-text class="ux-font-text-base-black">
                  {{ this.operationData.network | formattedNetwork | uppercase }}
                </ion-text>
              </div>
            </div>
          </div>
  `,
  styleUrls: ['./transfer-confirm-card.component.scss'],
})
export class TransferConfirmCardComponent implements OnInit {
  @Input() token : Coin;
  @Input() operationData: OperationDataInterface
  @Input() provider: any
  networkColors = NETWORK_COLORS;
  
  constructor() { }

  ionViewWillEnter() { }

  ngOnInit() { }

}
