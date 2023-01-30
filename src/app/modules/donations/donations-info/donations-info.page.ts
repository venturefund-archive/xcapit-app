import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { IonicStorageService } from 'src/app/shared/services/ionic-storage/ionic-storage.service';

@Component({
  selector: 'app-donations-info',
  template: ` <ion-header>
      <ion-toolbar color="primary" class="ux_toolbar ux_toolbar__rounded no-border">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="tabs/home"></ion-back-button>
        </ion-buttons>
        <ion-title class="ion-text-center">{{ 'donations.information.header' | translate }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <div class="ux_main">
        <div class="di__content ux_content">
          <div class="di__content__img ">
            <img src="assets/img/donations/information/information.svg" />
          </div>
          <div class="di__content__title">
            <ion-text class="ux-font-text-xl">
              {{ 'donations.information.title' | translate }}
            </ion-text>
          </div>
          <div class="di__content__items ">
            <div class="di__content__items__item">
              <img src="assets/img/donations/information/item_1.svg" />
              <ion-text class="ux-font-text-base">
                {{ 'donations.information.item_1' | translate }}
              </ion-text>
            </div>
            <div class="di__content__items__item">
              <img src="assets/img/donations/information/item_2.svg" />
              <ion-text class="ux-font-text-base">
                {{ 'donations.information.item_2' | translate }}
              </ion-text>
            </div>
          </div>
        </div>
        <div class="ux_footer">
          <div class="di__button">
            <ion-button
              class="ux_button"
              appTrackClick
              name="ux_donations_start"
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
    
  key =  'donationsIntroductionCompleted';
  constructor(private navController: NavController, private storage : IonicStorageService) {}

  ngOnInit() {}

  navigateToCauses() {
    this.storage.set(this.key, true);
    this.navController.navigateForward(['/donations/causes']);
  }
}
