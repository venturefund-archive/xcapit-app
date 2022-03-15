import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-investments-tab',
  template: `
    <ion-header>
      <ion-toolbar color="primary" class="ux_toolbar no-border">
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
              <div class="it__card_container__card__options">
                <app-investments-tab-card
                  [optionName]="option"
                  *ngFor="let option of this.optionNames"
                ></app-investments-tab-card>
              </div>
            </ion-card>
          </div>
          <div class="it__button_container">
            <ion-button
              appTrackClick
              class="ux-link-xs ion-no-margin ion-no-padding"
              name="How Investments Work"
              fill="clear"
              size="small"
              (click)="this.navigateToFAQ()"
            >
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
  constructor(private navController: NavController) {}

  ngOnInit() {}

  navigateToFAQ() {
    this.navController.navigateForward(['/support/options']);
  }
}
