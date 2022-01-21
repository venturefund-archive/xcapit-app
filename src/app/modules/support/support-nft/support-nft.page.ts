import { Component, OnInit } from '@angular/core';
import { NFT_TERMS } from '../shared-support/constants/nft-terms';

@Component({
  selector: 'app-support-nft',
  template:` 
  <ion-header>
  <ion-toolbar color="uxprimary" class="ux_toolbar">
    <ion-buttons slot="start">
      <ion-back-button defaultHref="support/options"></ion-back-button>
    </ion-buttons>
    <ion-title> {{ 'support.support_nft.header' | translate }}</ion-title>
  </ion-toolbar>
</ion-header>
<ion-content class="ion-padding-top">
  <div class="ux_main">
    <div class="sn__title">
      <ion-text class="ux-font-text-lg">
        {{ 'support.support_nft.title' | translate }}
      </ion-text>
    </div>
    <div class="ux_content">
      <div class="sn__cards_container">
        <app-faq *ngFor="let faq of this.faqs" [faq]="faq"></app-faq>
      </div>
      <app-contact-support></app-contact-support>
    </div>
  </div>
</ion-content>`,
  styleUrls: ['./support-nft.page.scss'],
})
export class SupportNftPage implements OnInit {
  faqs = NFT_TERMS;
  constructor() { }

  ngOnInit() {
  }

}
