import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-referrals-list',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button></ion-menu-button>
        </ion-buttons>
        <ion-title>
          {{ 'referrals.referrals_list.header' | translate }}
        </ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-fab vertical="bottom" horizontal="end" slot="fixed" ion-padding>
        <ion-fab-button
          appTrackClick
          name="New Referral"
          routerDirection="forward"
          [routerLink]="['/referrals/new']"
        >
          <ion-icon name="add"></ion-icon>
        </ion-fab-button>
      </ion-fab>
    </ion-content>
  `,
  styleUrls: ['./referrals-list.page.scss']
})
export class ReferralsListPage implements OnInit {
  constructor() {}

  ngOnInit() {}
}
