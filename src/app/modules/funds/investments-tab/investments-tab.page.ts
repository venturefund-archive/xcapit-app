import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-investments-tab',
  template: `
    <ion-header>
      <ion-toolbar color="uxprimary" class="ux_toolbar no-border">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/tabs/wallets"></ion-back-button>
        </ion-buttons>
        <ion-title class="ion-text-center">{{ 'funds.investments_tab.header' | translate }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div class="it">
        <div class="it__background"></div>
        <div class="it__content ion-padding-start ion-padding-end">
          <div class="it__card_container">
            <ion-card class="it__card_container__card ux-card-new ion-no-margin">
              <div class="it__card_container__card__img">
                <img src="assets/img/tabs/investments.svg" />
              </div>
              <ion-text class="it__card_container__card__text ux-font-header-titulo">
                {{ 'funds.investments_tab.text' | translate }}
              </ion-text>
              <app-investments-tab-card
                [optionName]="option"
                *ngFor="let option of this.optionNames"
              ></app-investments-tab-card>
            </ion-card>
          </div>
          <div class="it__button_container">
            <ion-button>
              {{ 'funds.investments_tab.how_investments_work_button' | translate }}
            </ion-button>
          </div>
        </div>
      </div>
    </ion-content>
  `,
  styleUrls: ['./investments-tab.page.scss'],
})
export class InvestmentsTabPage implements OnInit {
  optionNames: string[] = ['defi', 'binance'];
  constructor() {}

  ngOnInit() {}
}
