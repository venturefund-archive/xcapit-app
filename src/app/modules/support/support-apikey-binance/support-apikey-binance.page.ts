import { Component, OnInit } from '@angular/core';
import { ABOUT_APIKEY_BINANCE } from '../shared-support/constants/about-apikey-binance';

@Component({
  selector: 'app-support-apikey-binance',
  template: `
    <ion-header>
      <ion-toolbar color="uxprimary" class="ux_toolbar">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/support/options"></ion-back-button>
        </ion-buttons>
        <ion-title> {{ 'support.support_buy.header' | translate }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding-top">
      <div class="ux_main">
        <div class="sab__title">
          <ion-text class="ux-font-text-lg">
            {{ 'support.support_buy.title' | translate }}
          </ion-text>
        </div>
        <div class="ux_content">
          <div class="sab__cards_container">
            <app-faq *ngFor="let faq of this.faqs" [faq]="faq"></app-faq>
          </div>
          <app-contact-support></app-contact-support>
        </div>
      </div>
    </ion-content>
  `,
  styleUrls: ['./support-apikey-binance.page.scss'],
})
export class SupportApikeyBinancePage implements OnInit {
  faqs = ABOUT_APIKEY_BINANCE;
  constructor() {}

  ngOnInit() {}
}
