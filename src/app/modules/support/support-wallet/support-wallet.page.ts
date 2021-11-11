import { Component, OnInit } from '@angular/core';
import { ABOUT_WALLET } from '../shared-support/constants/about-wallet';

@Component({
  selector: 'app-support-wallet',
  template: ` <ion-header>
      <ion-toolbar color="uxprimary" class="ux_toolbar">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/support/options"></ion-back-button>
        </ion-buttons>
        <ion-title> {{ 'support.support_wallet.header' | translate }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding-top">
      <div class="ux_main">
        <div class="sw__title">
          <ion-text class="ux-font-text-lg">
            {{ 'support.support_wallet.title' | translate }}
          </ion-text>
        </div>
        <div class="ux_content">
          <div class="sw__cards_container">
            <app-faq *ngFor="let faq of this.faqs" [faq]="faq"></app-faq>
          </div>
          <app-contact-support></app-contact-support>
        </div>
      </div>
    </ion-content>`,
  styleUrls: ['./support-wallet.page.scss'],
})
export class SupportWalletPage implements OnInit {
  faqs = ABOUT_WALLET;
  constructor() {}

  ngOnInit() {}

  goToWalletInfo() {
    console.log('hahahaahaahah');
  }
}
