import { Component, OnInit } from '@angular/core';
import { ABOUT_WALLET_OPERATIONS } from '../shared-support/constants/about-wallet-operations';

@Component({
  selector: 'app-support-wallet-operations',
  template:  ` <ion-header>
  <ion-toolbar color="primary" class="ux_toolbar">
    <ion-buttons slot="start">
      <ion-back-button defaultHref="/support/options"></ion-back-button>
    </ion-buttons>
    <ion-title> {{ 'support.support_wallet_operations.header' | translate }}</ion-title>
  </ion-toolbar>
</ion-header>
<ion-content class="ion-padding-top">
  <div class="ux_main">
    <div class="sw__title">
      <ion-text class="ux-font-text-lg">
        {{ 'support.support_wallet_operations.title' | translate }}
      </ion-text>
    </div>
    <div class="ux_content">
      <div class="sw__cards_container">
        <app-faq *ngFor="let faq of this.faqs" [faq]="faq"></app-faq>
      </div>
      <app-contact-support></app-contact-support>
    </div>
  </div>
</ion-content>
   
`,
  styleUrls: ['./support-wallet-operations.page.scss'],
})
export class SupportWalletOperationsPage implements OnInit {
  faqs = ABOUT_WALLET_OPERATIONS;
  constructor() { }

  ngOnInit() {
  }

}
