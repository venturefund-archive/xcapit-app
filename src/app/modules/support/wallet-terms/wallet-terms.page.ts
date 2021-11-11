import { Component, OnInit } from '@angular/core';
import { WALLET_TERMS } from '../shared-support/constants/wallet-terms';

@Component({
  selector: 'app-wallet-terms',
  template: ` <ion-header>
      <ion-toolbar color="uxprimary" class="ux_toolbar">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/support/wallet-info"></ion-back-button>
        </ion-buttons>
        <ion-title> {{ 'support.wallet_terms.header' | translate }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding-top">
      <div class="ux_main">
        <div class="ux_content">
          <div class="wt__info">
            <ion-text class="wt__title ux-font-text-lg">
              {{ 'support.wallet_terms.title' | translate }}
            </ion-text>
            <ion-text class="wt__description" [innerHTML]="'support.wallet_terms.subtitle' | translate"></ion-text>
          </div>
          <div class="wt__cards_container">
            <app-faq *ngFor="let faq of this.faqs" [faq]="faq"></app-faq>
          </div>
        </div>
      </div>
    </ion-content>`,
  styleUrls: ['./wallet-terms.page.scss'],
})
export class WalletTermsPage implements OnInit {
  subtitle: 'support.wallet_terms.subtitle';
  faqs = WALLET_TERMS;
  constructor() {}

  ngOnInit() {}
}
