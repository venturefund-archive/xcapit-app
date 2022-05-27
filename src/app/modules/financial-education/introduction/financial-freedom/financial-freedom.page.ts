import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { TrackService } from 'src/app/shared/services/track/track.service';

@Component({
  selector: 'app-financial-freedom',
  template: ` <ion-header>
      <ion-toolbar color="primary" class="ux_toolbar no-border">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="tabs/home"></ion-back-button>
        </ion-buttons>
        <ion-title class="ion-text-center">{{ 'financial_education.introduction.financial_freedom.header' | translate }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <div class="ux_main">
        <div class="ff__content ux_content ion-padding">
          <div class="ff__content__img">
            <img src="assets/img/financial-education/financial_freedom.svg" />
          </div>
          <div class="ff__content__title">
            <ion-text class="ux-font-text-xl">
              {{ 'financial_education.introduction.financial_freedom.title' | translate }}
            </ion-text>
          </div>
          <div class="ff__content__subtitle">
            <ion-text class="ux-font-text-base">
              {{ 'financial_education.introduction.financial_freedom.subtitle' | translate }}
            </ion-text>
          </div>
        </div>
        <div class="ux_footer">
          <div class="ff__button">
            <ion-button
              class="ux_button"
              appTrackClick
              name="ux_education_next"
              type="submit"
              color="secondary"
              size="large"
              (click)="this.navigateExplanation()"
            >
              {{ 'financial_education.introduction.financial_freedom.button' | translate }}
            </ion-button>
          </div>
        </div>
      </div>
    </ion-content>`,
  styleUrls: ['./financial-freedom.page.scss'],
})
export class FinancialFreedomPage implements OnInit {
  constructor(private navController : NavController, private trackService : TrackService) {}

  ngOnInit() {}

  navigateExplanation() {
    this.navController.navigateForward('financial-education/introduction/explanation')
  }

  ionViewWillEnter(){
    this.trackService.trackEvent({
      eventAction: 'screenview',
      description: window.location.href,
      eventLabel: 'ux_education_screenview_intro_1'
    });
  }
}
