import { Component, OnInit } from '@angular/core';
import { ABOUT_XCAPIT_OPTIONS } from '../shared-support/constants/about-xcapit-account';

@Component({
  selector: 'app-support-account',
  template: ` <ion-header>
      <ion-toolbar color="primary" class="ux_toolbar">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/support/options"></ion-back-button>
        </ion-buttons>
        <ion-title> {{ 'support.support_account_xcapit.header' | translate }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding-top">
      <div class="ux_main">
        <div class="sa__title">
          <ion-text class="ux-font-text-lg">
            {{ 'support.support_account_xcapit.title' | translate }}
          </ion-text>
        </div>
        <div class="ux_content">
          <div class="sa__cards_container">
            <app-faq *ngFor="let faq of this.faqs" [faq]="faq"></app-faq>
          </div>
          <app-contact-support></app-contact-support>
        </div>
      </div>
    </ion-content>`,
  styleUrls: ['./support-account.page.scss'],
})
export class SupportAccountPage implements OnInit {
  faqs = ABOUT_XCAPIT_OPTIONS;
  constructor() {}

  ngOnInit() {}
}
