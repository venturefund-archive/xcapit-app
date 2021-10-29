import { Component, OnInit } from '@angular/core';
import { ABOUT_BINANCE } from '../shared-support/constants/about-binance-investments';

@Component({
  selector: 'app-support-binance-investments',
  template: ` <ion-header>
      <ion-toolbar color="uxprimary" class="ux_toolbar">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/support/options"></ion-back-button>
        </ion-buttons>
        <ion-title> {{ 'support.support_binance.header' | translate }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding-top">
      <div class="ux_main">
        <div class="sbi__title">
          <ion-text class="ux-font-text-lg">
            {{ 'support.support_binance.title' | translate }}
          </ion-text>
        </div>
        <div class="ux_content">
          <div class="sbi__cards_container">
            <app-faq *ngFor="let faq of this.faqs" [faq]="faq"></app-faq>
          </div>
          <app-contact-support></app-contact-support>
        </div>
      </div>
    </ion-content>`,
  styleUrls: ['./support-binance-investments.page.scss'],
})
export class SupportBinanceInvestmentsPage implements OnInit {
  faqs = ABOUT_BINANCE;

  constructor() {}

  ngOnInit() {}
}
