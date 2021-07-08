import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-recovery-phrase',
  template: `
    <ion-header>
      <ion-toolbar color="uxprimary" class="ux_toolbar">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/wallets/home"></ion-back-button>
        </ion-buttons>
        <ion-title class="ion-text-center">{{ 'wallets.recovery-phrase.header' | translate }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <div name="Content" class="ux-content">
        <ion-text>{{ 'wallets.recovery-phrase.title' | translate }}</ion-text>
        <ion-text>{{ 'wallets.recovery-phrase.text1' | translate }}</ion-text>
        <ion-text>{{ 'wallets.recovery-phrase.text2' | translate }}</ion-text>
        <ion-text>{{ 'wallets.recovery-phrase.text3' | translate }}</ion-text>
        <ion-text>{{ 'wallets.recovery-phrase.text4' | translate }}</ion-text>

        <app-recovery-phrase-card></app-recovery-phrase-card>
      </div>
    </ion-content>
  `,
  styleUrls: ['./recovery-phrase.page.scss'],
})
export class RecoveryPhrasePage implements OnInit {
  constructor() {}

  ngOnInit() {}
}
