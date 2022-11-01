import { Component, OnInit } from '@angular/core';
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
    <ion-content class="ion-padding kod" *ngIf="this.operation">
      <div class="kod__card-container">
        <ion-card class="kod__card-container__card">
          <div class="kod__card-container__card__title">
            <ion-text></ion-text>
          </div>
          <div class="kod__card-container__card__coin">
            <div class="kod__card-container__card__coin__icon">
              <img [src]="this.token.logoRoute" alt="Token"/>
            </div>
            <div class="kod__card-container__card__coin__content">
              <div class="kod__card-container__card__coin__content__name">
                <ion-text></ion-text>
              </div>
              <div class="kod__card-container__card__coin__content__network">
                <!-- App network badge -->
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
          </div>
        </ion-card>
      </div>
    </ion-content>
  `,
  styleUrls: ['./kripton-operation-detail.page.scss'],
})
export class KriptonOperationDetailPage implements OnInit {
  provider: FiatRampProvider;
  constructor() {}

  ngOnInit() {}

  ionViewWillEnter() {}
}
