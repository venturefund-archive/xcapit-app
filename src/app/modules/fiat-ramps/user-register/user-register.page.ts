import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { BrowserService } from 'src/app/shared/services/browser/browser.service';
import { TrackService } from 'src/app/shared/services/track/track.service';
import { USER_REGISTER_STEPS } from '../shared-ramps/constants/user-register-steps';
import { FiatRampsService } from '../shared-ramps/services/fiat-ramps.service';
import { StorageOperationService } from '../shared-ramps/services/operation/storage-operation.service';

@Component({
  selector: 'app-user-register',
  template: `
    <ion-header>
      <ion-toolbar mode="ios" color="primary" class="ux_toolbar">
        <ion-buttons *ngIf="this.userStatus !== 'COMPLETE'" slot="start">
          <ion-back-button defaultHref="/fiat-ramps/user-email"></ion-back-button>
        </ion-buttons>
        <ion-buttons *ngIf="this.userStatus === 'COMPLETE'" slot="start">
          <ion-button class="ur__button-back" (click)="this.navigateBackToWallet()">
            <ion-icon slot="icon-only" name="chevron-back-outline"></ion-icon
          ></ion-button>
        </ion-buttons>
        <ion-title>
          {{ 'fiat_ramps.user_register.header' | translate }}
        </ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ur__container">
      <div class="ur__container__provider">
        <ion-text class="ux-font-text-xxs">{{ 'fiat_ramps.user_register.provider' | translate }}</ion-text>
      </div>
      <div class="ur__container__icon">
        <img src="assets/img/provider-logos/KriptonMarket.svg" />
      </div>
      <app-user-register-content *ngIf="this.userStatus" [status]="this.userStatus"> </app-user-register-content>
      <div class="ur__container__card">
        <app-user-register-step-card
          *ngFor="let step of this.steps"
          [status]="this.userStatus"
          [order]="step.order"
          [title]="step.title"
          [subtitle]="step.subtitle"
          [url]="step.url"
          [disabled]="step.disabled"
          [name]="step.name"
        >
        </app-user-register-step-card>
      </div>
      <div *ngIf="this.userStatus !== 'COMPLETE'" class="ur__container__disclaimer">
        <img src="assets/ux-icons/ux-inbox.svg" />
        <ion-text class="ux-font-text-xs">
          {{ 'fiat_ramps.user_register.disclaimer.content' | translate }}
          <span class="ux-link-xs" (click)="openTyC()">{{
            'fiat_ramps.user_register.disclaimer.link' | translate
          }}</span>
        </ion-text>
      </div>
    </ion-content>
    <ion-footer *ngIf="this.userStatus === 'COMPLETE'" class="ur__footer">
      <div class="ux_footer ion-padding">
        <ion-button
          class="ux_button"
          name="ux_go_to_buy_home"
          color="secondary"
          size="large"
          expand="block"
          (click)="this.navigateMyPurchases()"
        >
          {{ 'fiat_ramps.user_register.button' | translate }}
        </ion-button>
      </div>
    </ion-footer>
  `,
  styleUrls: ['./user-register.page.scss'],
})
export class UserRegisterPage implements OnInit {
  steps = USER_REGISTER_STEPS;
  userStatus: string;
  constructor(
    private browser: BrowserService,
    private storageOperationService: StorageOperationService,
    private fiatRampsService: FiatRampsService,
    private navController: NavController,
    private trackService: TrackService
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.userRegistrationStatus();
    this.trackEvent();
  }

  async userRegistrationStatus() {
    const email = this.storageOperationService.getData().email;
    this.fiatRampsService.getOrCreateUser({ email }).subscribe((res) => {
      this.userStatus = res.registration_status;
    });
  }

  trackEvent() {
    this.trackService.trackEvent({
      eventAction: 'screenview',
      description: window.location.href,
      eventLabel: 'ux_buy_kripton_register_success',
    });
  }

  openTyC() {
    return this.browser.open({ url: 'https://cash.kriptonmarket.com/privacy' });
  }

  navigateBackToWallet() {
    this.navController.navigateBack(['/tabs/wallet']);
  }
  navigateMyPurchases() {
    this.navController.navigateBack(['/fiat-ramps/purchases']);
  }
}
