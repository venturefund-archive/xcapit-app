import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-inteligent-stop-loss-information',
  template: `<ion-header>
      <ion-toolbar color="uxprimary" class="ux_toolbar">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/funds/fund-stop-loss"></ion-back-button>
        </ion-buttons>
        <ion-title>{{ 'funds.fund_stop_loss.inteligent_stop_loss_header' | translate }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <div class="ux_main">
        <div name="Content" class="ux_content">
          <div class="title">
            <ion-text class="ux-font-text-lg">{{
              'funds.fund_stop_loss.inteligent_stop_loss_title' | translate
            }}</ion-text>
          </div>
          <div class="text">
            <ion-text class="ux-font-text-base">{{
              'funds.fund_stop_loss.inteligent_stop_loss_text' | translate
            }}</ion-text>
          </div>
          <div class="text1">
            <ion-text class="ux-font-text-base">{{
              'funds.fund_stop_loss.inteligent_stop_loss_text1' | translate
            }}</ion-text>
          </div>
          <div class="text2">
            <ion-text class="ux-font-text-base">{{
              'funds.fund_stop_loss.inteligent_stop_loss_text2' | translate
            }}</ion-text>
          </div>
        </div>
        <div class="ux_footer">
          <div class="button">
            <ion-button class="ux_button" appTrackClick name="Back" size="large" (click)="this.goBack()">
              {{ 'funds.fund_stop_loss.inteligent_stop_loss_button' | translate }}
            </ion-button>
          </div>
        </div>
      </div>
    </ion-content>`,
  styleUrls: ['./inteligent-stop-loss-information.page.scss'],
})
export class InteligentStopLossInformationPage implements OnInit {
  constructor(private navController: NavController) {}

  ngOnInit() {}

  goBack() {
    this.navController.navigateBack(['/funds/fund-stop-loss']);
  }
}
