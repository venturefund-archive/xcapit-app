import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-commission',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/tabs/funds"></ion-back-button>
        </ion-buttons>
        <ion-title>{{ 'funds.commissions.header' | translate }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <app-commissions-content></app-commissions-content>
    </ion-content>
  `,
  styleUrls: ['./commission.page.scss']
})
export class CommissionPage implements OnInit {
  constructor() {}

  ngOnInit() {}
}
