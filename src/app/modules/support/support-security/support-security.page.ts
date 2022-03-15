import { Component, OnInit } from '@angular/core';
import { ABOUT_SECURITY } from '../shared-support/constants/about-security';

@Component({
  selector: 'app-support-security',
  template: `
    <ion-header>
      <ion-toolbar color="primary" class="ux_toolbar">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="support/options"></ion-back-button>
        </ion-buttons>
        <ion-title> {{ 'support.support_security.header' | translate }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding-top">
      <div class="ux_main">
        <div class="ss__title">
          <ion-text class="ux-font-text-lg">
            {{ 'support.support_security.title' | translate }}
          </ion-text>
        </div>
        <div class="ux_content">
          <div class="ss__cards_container">
            <app-faq *ngFor="let faq of this.faqs" [faq]="faq"></app-faq>
          </div>
          <app-contact-support></app-contact-support>
        </div>
      </div>
    </ion-content>
  `,
  styleUrls: ['./support-security.page.scss'],
})
export class SupportSecurityPage implements OnInit {
  faqs = ABOUT_SECURITY;
  constructor() {}

  ngOnInit() {}
}
