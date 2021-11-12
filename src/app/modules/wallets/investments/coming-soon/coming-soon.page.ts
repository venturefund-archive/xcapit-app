import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-coming-soon',
  template: `
    <ion-header>
      <ion-toolbar color="uxprimary" class="ux_toolbar no-border">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/tabs/wallets"></ion-back-button>
        </ion-buttons>
        <ion-title class="ion-text-center">{{ 'wallets.investments.coming-soon' | translate }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div class="cs">
        <div class="cs__background"></div>
        <div class="cs__card"></div>
      </div>
    </ion-content>
  `,
  styleUrls: ['./coming-soon.page.scss'],
})
export class ComingSoonPage implements OnInit {
  constructor() {}

  ngOnInit() {}
}
