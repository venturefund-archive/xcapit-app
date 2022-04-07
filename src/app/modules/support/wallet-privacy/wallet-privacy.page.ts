import { Component, OnInit } from '@angular/core';
import { WALLET_PRIVACY } from '../shared-support/constants/wallet-privacy';

@Component({
  selector: 'app-wallet-privacy',
  template: ` <ion-header>
      <ion-toolbar color="primary" class="ux_toolbar">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/support/wallet-info"></ion-back-button>
        </ion-buttons>
        <ion-title> {{ 'support.wallet_privacy.header' | translate }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding-top">
      <div class="ux_main">
        <div class="ux_content">
          <div class="wp__info">
            <ion-text class="wp__title ux-font-text-lg">
              {{ 'support.wallet_privacy.title' | translate }}
            </ion-text>
            <ion-text
              class="wp__description ux-font-text-base"
              [innerHTML]="'support.wallet_privacy.subtitle' | translate"
            ></ion-text>
          </div>
          <div class="wp__cards_container">
            <app-faq *ngFor="let faq of this.faqs" [faq]="faq"></app-faq>
          </div>
        </div>
      </div>
    </ion-content>`,
  styleUrls: ['./wallet-privacy.page.scss'],
})
export class WalletPrivacyPage implements OnInit {
  faqs = WALLET_PRIVACY;
  constructor() {}

  ngOnInit() {}
}
