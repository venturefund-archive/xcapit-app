import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-how-create-binance-account',
  template: ` <ion-header>
      <ion-toolbar color="uxprimary" class="ux_toolbar">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/apikeys/apikey-information"></ion-back-button>
        </ion-buttons>
        <ion-title>{{ 'apikeys.how_create_binance_account.header' | translate }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <div class="ux_main hcba">
        <div class="ux_content">
          <div class="hcba__title">
            <ion-text class="ux-font-text-lg">
              {{ 'apikeys.how_create_binance_account.title' | translate }}
            </ion-text>
          </div>
          <div class="hcba__description">
            <ion-text class="ux-font-text-base step">
              {{ 'apikeys.how_create_binance_account.text1' | translate }}
            </ion-text>
            <ion-text class="ux-font-text-base step ">
              {{ 'apikeys.how_create_binance_account.text2' | translate }}
            </ion-text>
            <ion-text class="ux-font-text-base step">
              {{ 'apikeys.how_create_binance_account.text3' | translate }}
            </ion-text>
            <ion-text class="ux-font-text-base step">
              {{ 'apikeys.how_create_binance_account.text4' | translate }}
            </ion-text>
          </div>
          <div class="hcba__embed">
            <app-embed-video url="https://www.youtube.com/embed/2tr-aQ78Ohg"></app-embed-video>
          </div>
        </div>
        <div class="ux_footer">
          <ion-button
            color="uxsecondary"
            appTrackClick
            name="Have A Binance Account"
            class="ux_button hcba__button"
            (click)="this.goToTutorialAPIKey()"
          >
            {{ 'apikeys.how_create_binance_account.button' | translate }}
          </ion-button>
        </div>
      </div>
    </ion-content>`,
  styleUrls: ['./how-create-binance-account.page.scss'],
})
export class HowCreateBinanceAccountPage implements OnInit {
  constructor(private navController: NavController) {}

  ngOnInit() {}

  goToTutorialAPIKey() {
    this.navController.navigateForward(['/apikeys/tutorial/apikeys']);
  }
}
