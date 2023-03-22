import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-kripton-sale-summary',
  template: `<ion-header>
      <ion-toolbar mode="ios" color="primary" class="ux_toolbar">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/fiat-ramps/purchases"></ion-back-button>
        </ion-buttons>
        <ion-title>
          {{ 'fiat_ramps.kripton_operation_detail.header' | translate }}
        </ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding kss">
      <div class="kss__card-container">
        <ion-card class="kss__card-container__card ux-card-new ion-no-margin no-border">
          <div class="kss__card-container__card__title">
            <ion-text class="ux-font-text-xl">
              {{ 'fiat_ramps.kripton_operation_detail.title' | translate }}
            </ion-text>
          </div>
        </ion-card>
      </div>
    </ion-content>`,
  styleUrls: ['./kripton-sale-summary.page.scss'],
})
export class KriptonSaleSummaryPage implements OnInit {
  constructor() {}

  ngOnInit() {}
}
