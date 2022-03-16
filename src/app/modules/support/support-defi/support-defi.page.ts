import { Component, OnInit } from '@angular/core';
import { ABOUT_DEFI } from '../shared-support/constants/about-defi';

@Component({
  selector: 'app-support-defi',
  template: `
    <ion-header>
      <ion-toolbar color="uxprimary" class="ux_toolbar">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/support/options"></ion-back-button>
        </ion-buttons>
        <ion-title> {{ 'support.support_defi.header' | translate }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding-top">
      <div class="ux_main">
        <div class="sb__title">
          <ion-text class="ux-font-text-lg">
            {{ 'support.support_defi.title' | translate }}
          </ion-text>
        </div>
        <div class="ux_content">
          <div class="sb__cards_container">
            <app-faq *ngFor="let faq of this.faqs" [faq]="faq"></app-faq>
          </div>
          <app-contact-support></app-contact-support>
        </div>
      </div>
    </ion-content>
  `,
  styleUrls: ['./support-defi.page.scss'],
})
export class SupportDefiPage implements OnInit {
  faqs = ABOUT_DEFI;

  constructor() {}

  ngOnInit() {}
}
