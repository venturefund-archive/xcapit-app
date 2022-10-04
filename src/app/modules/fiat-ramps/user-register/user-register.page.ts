import { Component, OnInit } from '@angular/core';
import { BrowserService } from 'src/app/shared/services/browser/browser.service';
import { USER_REGISTER_STEPS } from '../shared-ramps/constants/user-register-steps';

@Component({
  selector: 'app-user-register',
  template: ` <ion-header>
      <ion-toolbar mode="ios" color="primary" class="ux_toolbar">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/fiat-ramps/user-email"></ion-back-button>
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
      <div class="ur__container__title">
        <ion-text class="ux-font-text-lg">{{ 'fiat_ramps.user_register.title' | translate }}</ion-text>
      </div>
      <div class="ur__container__subtitle">
        <ion-text class="ux-font-text-base">{{ 'fiat_ramps.user_register.subtitle' | translate }}</ion-text>
      </div>
      <div class="ur__container__card">
        <app-user-register-step-card
          *ngFor="let step of this.steps"
          [number]="step.number"
          [title]="step.title"
          [subtitle]="step.subtitle"
          [url]="step.url"
          [disabled]="step.disabled"
        >
        </app-user-register-step-card>
      </div>
      <div class="ur__container__disclaimer">
        <img src="assets/ux-icons/ux-inbox.svg" />
        <ion-text class="ux-font-text-xs"
          > {{'fiat_ramps.user_register.disclaimer.content' | translate}}
          <span class="ux-link-xs" (click)="openTyC()">{{'fiat_ramps.user_register.disclaimer.link' | translate}}</span>
        </ion-text>
      </div>
    </ion-content>`,
  styleUrls: ['./user-register.page.scss'],
})
export class UserRegisterPage implements OnInit {
  steps = USER_REGISTER_STEPS;
  constructor(private browser: BrowserService) {}

  ngOnInit() {}

  openTyC() {
    return this.browser.open({ url: 'https://cash.kriptonmarket.com/privacy' });
  }
}
