import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-donations-info',
  template:`
   <ion-header>
      <ion-toolbar color="primary" class="ux_toolbar no-border">
      <ion-buttons slot="start">
          <ion-back-button defaultHref="tabs/home"></ion-back-button>
        </ion-buttons>
        <ion-title class="ion-text-center">{{ 'donations.information.header' | translate }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <div class="ux_main">
        <div class="fpi__content ux_content">
          <div class="fpi__content__img ">
            <img src="assets/img/donations/information/information.svg" />
          </div>
          <div class="fpi__content__title">
            <ion-text class="ux-font-text-xl">
              {{ 'donations.information.title' | translate }}
            </ion-text>
          </div>
          <div class="fpi__content__items ">
            <div class="fpi__content__items__item">
              <img src="assets/img/donations/information/item_1.svg" />
              <ion-text class="ux-font-text-base">
                {{ 'donations.information.item_1' | translate }}
              </ion-text>
            </div>
            <div class="fpi__content__items__item">
              <img src="assets/img/donations/information/item_2.svg" />
              <ion-text class="ux-font-text-base">
                {{ 'donations.information.item_2' | translate }}
              </ion-text>
            </div>
          </div>
        </div>
        <div class="ux_footer">
          <div class="fpi__button">
            <ion-button
              class="ux_button"
              appTrackClick
              name="go_to_planner"
              type="submit"
              color="secondary"
              size="large"
              (click)="this.navigateToCauses()"
            >
              {{ 'donations.information.button' | translate }}
            </ion-button>
          </div>
        </div>
      </div>
    </ion-content>`,
  styleUrls: ['./donations-info.page.scss'],
})
export class DonationsInfoPage implements OnInit {

  constructor(private navController: NavController,) { }

  ngOnInit() {
  }

  navigateToCauses(){
    this.navController.navigateForward(['/donations/causes']);
  }

}
