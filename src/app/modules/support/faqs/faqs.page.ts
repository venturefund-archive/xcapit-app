import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ABOUT_BUY } from '../shared-support/constants/about-buy';
import { ABOUT_WALLET } from '../shared-support/constants/about-wallet';
import { ABOUT_WALLET_CONNECT } from '../shared-support/constants/about-wallet-connect';
import { ABOUT_WALLET_OPERATIONS } from '../shared-support/constants/about-wallet-operations';
import { ABOUT_WALLET_SWAP } from '../shared-support/constants/about-wallet-swap';
import { NFT_TERMS } from '../shared-support/constants/nft-terms';

@Component({
  selector: 'app-faqs',
  template: `
    <ion-header>
      <ion-toolbar color="primary" class="ux_toolbar">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/support/options"></ion-back-button>
        </ion-buttons>
        <ion-title> {{ this.header | translate }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding-top">
      <div class="ux_main">
        <div class="fq__title">
          <ion-text class="ux-font-text-lg">
            {{ this.title | translate }}
          </ion-text>
        </div>
        <div class="ux_content">
          <div class="fq__cards_container">
            <app-faq *ngFor="let faq of this.faqs" [faq]="faq"></app-faq>
          </div>
          <app-contact-support></app-contact-support>
        </div>
      </div>
    </ion-content>
  `,
  styleUrls: ['./faqs.page.scss'],
})
export class FaqsPage implements OnInit {
  faqs = [];
  header: string;
  title: string;
  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
  }

  ionViewWillEnter(){
    this.setFaqs();
  }

  setFaqs() {
    const topic = this.route.snapshot.paramMap.get('topic');
    this.header = `support.support_${topic}.header`;
    this.title = `support.support_${topic}.title`;
    const faqs = {
      wallet: ABOUT_WALLET,
      wallet_operations: ABOUT_WALLET_OPERATIONS,
      nft: NFT_TERMS,
      buy: ABOUT_BUY,
      wallet_connect: ABOUT_WALLET_CONNECT,
      wallet_swap: ABOUT_WALLET_SWAP
    }

    this.faqs = faqs[topic];
    
  }
}
