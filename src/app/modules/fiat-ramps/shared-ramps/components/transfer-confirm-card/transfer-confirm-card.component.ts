import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-transfer-confirm-card',
  template: ` 
  <div class="cp__content">
        <app-ux-loading-block *ngIf="!this.operationData" minSize="30px"></app-ux-loading-block>
        <!-- <div class="op__card ux-card-new" *ngIf="this.operationData"> -->
        <div class="op__card ux-card-new">
          <div class="op__card__token">
            <img [src]="this.token.logoRoute" alt="Token" />
            {{ this.token.name }}
          </div>

          <div class="op__card__item">
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

          <div class="op__card__item">
            <ion-label>
              {{ 'fiat_ramps.confirm.amount' | translate }}
            </ion-label>
            <ion-text> {{ this.operationData.amount_in }} {{ this.operationData.currency_in }} </ion-text>
          </div>

          <div class="op__card__item">
            <ion-label>
              {{ 'fiat_ramps.confirm.quotation' | translate }}
            </ion-label>
            <ion-text>
              1 {{ this.operationData.currency_out }} =
              {{ this.operationData.price_out }}
              {{ this.operationData.currency_in }}
            </ion-text>
          </div>

          <div class="op__card__item">
            <ion-label>
              {{ 'fiat_ramps.confirm.provider' | translate }}
            </ion-label>

            <ion-text>
              {{ this.provider.name }}
            </ion-text>
          </div>

          <div class="op__card__item">
            <ion-label>
              {{ 'fiat_ramps.confirm.wallet' | translate }}
            </ion-label>
            <ion-text>{{ this.operationData.wallet }}</ion-text>
          </div>

          <div class="op__card__item">
            <ion-label>{{ 'fiat_ramps.confirm.network' | translate }}</ion-label>

            <ion-badge
              [color]="this.networkColors[this.operationData.network]"
              class="ux-badge ux-font-num-subtitulo"
              >{{ this.operationData.network | formattedNetwork | uppercase }}</ion-badge
            >
          </div>
        </div>
      </div>
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
