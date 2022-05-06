import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-transfer-confirm-card',
  template: ` 
  <div class="cp__content">
        <app-ux-loading-block *ngIf="!this.operationData" minSize="30px"></app-ux-loading-block>
        <div class="tcc__card ux-card-new" *ngIf="this.operationData">
          <div class="tcc__card__token">
            <img [src]="this.token.logoRoute" alt="Token" />
            {{ this.token.name }}
          </div>

          <div class="tcc__card__item">
            <ion-label>{{ 'fiat_ramps.confirm.type' | translate }}</ion-label>
            <ion-text>
              {{ 'fiat_ramps.confirm.operationType' | translate }}
            </ion-text>
            <ion-text>
              {{ this.operationData.currency_out }}
              {{ 'fiat_ramps.confirm.with' | translate }}
              {{ this.operationData.currency_in }}
            </ion-text>
          </div>

          <div class="tcc__card__item">
            <ion-label>
              {{ 'fiat_ramps.confirm.amount' | translate }}
            </ion-label>
            <ion-text> {{ this.operationData.amount_in }} {{ this.operationData.currency_in }} </ion-text>
          </div>

          <div class="tcc__card__item">
            <ion-label>
              {{ 'fiat_ramps.confirm.quotation' | translate }}
            </ion-label>
            <ion-text>
              1 {{ this.operationData.currency_out }} =
              {{ this.operationData.price_out }}
              {{ this.operationData.currency_in }}
            </ion-text>
          </div>

          <div class="tcc__card__item">
            <ion-label>
              {{ 'fiat_ramps.confirm.provider' | translate }}
            </ion-label>

            <ion-text>
              {{ this.provider.name }}
            </ion-text>
          </div>

          <div class="tcc__card__item">
            <ion-label>
              {{ 'fiat_ramps.confirm.wallet' | translate }}
            </ion-label>
            <ion-text>{{ this.operationData.wallet }}</ion-text>
          </div>

          <div class="tcc__card__item">
            <ion-label>{{ 'fiat_ramps.confirm.network' | translate }}</ion-label>

            <ion-badge
              [color]="this.networkColors[this.operationData.network]"
              class="ux-badge ux-font-num-subtitulo"
              >{{ this.operationData.network | formattedNetwork | uppercase }}</ion-badge
            >
          </div>
        </div>
      </div>
      <!-- TEMPLATE REFERENCIA DISEÑO -->
        <app-ux-loading-block *ngIf="!this.operationData" minSize="30px"></app-ux-loading-block>
          <div class="tcc__card ux-card-new" *ngIf="this.operationData">
            <div class="tcc__card__name-and-icon">
              <div class="tcc__card__name-and-icon__icon">
                <img [src]="this.token.logoRoute" alt="Token" />
                {{ this.token.name }}
              </div>
              <div class="tcc__card__name-and-icon__name ux-font-text-base">
                <ion-text>TITULO MONEDA</ion-text>
              </div>
            </div>

            <div class="tcc__card__operation-title">
              <!-- Ver si va el operationType o si creamos uno nuevo -->
              <ion-text class="ux-font-titulo-xs">{{ 'fiat_ramps.confirm.type' | translate }}</ion-text>
            </div>

            <div class="tcc__card__operation__content">
              <ion-text class="ux-font-text-base">
                <span *ngIf="this.operationData.type === 'cash-in'">
                  {{ 'fiat_ramps.confirm.buy.operationType' | translate }}
                  <span>
                    {{ this.operationData.currency_out | uppercase }}
                    {{ 'fiat_ramps.confirm.buy.with' | translate }} {{ this.operationData.currency_in | uppercase }}
                  </span>
                </span>
                <!-- VERIFICAR EN es.json si es "VENTA"/"VENDER"/"VENDE" -->
                <span *ngIf="this.operationData.type === 'cash-out'">
                  {{ 'fiat_ramps.confirm.sell.operationType' | translate }}
                  <span>
                  {{ this.operationData.currency_in | uppercase }}
                  {{ 'fiat_ramps.confirm.sell.with' | translate }} {{ this.operationData.currency_out | uppercase }}
                  </span>
                </span>
              </ion-text>
            </div>

            <div class="tcc__card__amount">
              <div class="tcc__card__amount__title ux-font-titulo-xs">
                <ion-text> {{ 'fiat_ramps.confirm.amount' | translate }}</ion-text>
              </div>
              <div class="tcc__card__amount__content">
                <ion-text class="ux-font-text-base"> {{ this.operationData.amount_in }} {{ this.operationData.currency_in }} </ion-text>
              </div>
            </div>

            <div class="tcc__card__quotation">
              <div class="tcc__card__title">
                <div class="tcc__card__quotation__title ux-font-titulo-xs">
                  <ion-text> {{ 'fiat_ramps.confirm.quotation' | translate }} </ion-text>
                </div>
              </div>
              <div class="tcc__card__content">
              <ion-text class="ux-font-text-base">
                {{ this.operationData.price_out }}
                {{ this.operationData.currency_out }} =
                {{ this.operationData.price_in }}
                {{ this.operationData.currency_in }}
              </ion-text>
              </div>
            </div>
          </div> 
      <!-- <div class="tsc__amount">
        <div class="tsc__amount__title">
          <ion-text class="ux-font-titulo-xs">{{ this.provider }}</ion-text>
        </div>
        <div class="tsc__amount__content">
          <ion-text class="ux-font-text-base"
            >{{ this.provider }} {{ this.provider }}</ion-text
          >
          <ion-text class="ux-font-text-base">{{ this.provider }} USD</ion-text>
        </div>
      </div>
      <div class="tsc__address">
        <div class="tsc__address__title">
          <ion-text class="ux-font-titulo-xs">{{ this.provider }}</ion-text>
        </div>
        <div class="tsc__address__content">
          <ion-text class="ux-font-text-base">{{ this.provider }}</ion-text>
        </div>
      </div>
      <div class="tsc__fee">
        <div class="tsc__fee__title">
          <ion-text class="ux-font-titulo-xs">
            {{ 'wallets.send.send_summary.fee' | translate }}
          </ion-text>
        </div>
        <div class="tsc__fee__fee">
          <ion-text class="saic__fee__fee__amount ux-font-text-base"
            >{{ this.provider | number: '1.5-5' }} {{ this.provider }}</ion-text
          >
          <ion-text class="saic__fee__fee__reference_amount ux-font-text-base"
            >{{ this.provider | number: '1.2-2' }} USD</ion-text
          >
        </div>
      </div>
    </div> -->

  `,
  styleUrls: ['./transfer-confirm-card.component.scss'],
})
export class TransferConfirmCardComponent implements OnInit {
  @Input() token : any
  @Input() operationData: any
  @Input() provider: any
  @Input() networkColors: any
  constructor() { }

  ionViewWillEnter() {
    console.log(this.operationData)
  }

  ngOnInit() {
    console.log(this.operationData)
  }

}
