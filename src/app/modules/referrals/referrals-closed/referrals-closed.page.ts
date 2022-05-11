import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-referrals-closed',
  template: `
    <ion-header>
      <ion-toolbar color="primary" class="ux_toolbar">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/tabs/home"></ion-back-button>
        </ion-buttons>
        <ion-title class="ion-text-center">{{ 'referrals.referrals_closed.header' | translate }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="rs ion-padding">
      <div class="rc__referrals-coming">
        <app-referrals-coming></app-referrals-coming>
      </div>
    </ion-content>
  `,
  styleUrls: ['./referrals-closed.page.scss'],
})
export class ReferralsClosedPage implements OnInit {
  constructor() {}

  ngOnInit() {}
}
