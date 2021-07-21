import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-verify-phrase',
  template: `
    <ion-header>
      <ion-toolbar color="uxprimary" class="ux_toolbar">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/wallets/create-first/recovery-phrase"></ion-back-button>
        </ion-buttons>
        <ion-title class="ion-text-center">{{ 'wallets.verify-phrase.header' | translate }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <div name="Content" class="ux-content">
        <div class="title">
          <ion-text class="ux-font-gilroy ux-fweight-extrabold ux-fsize-22">{{
            'wallets.verify-phrase.title' | translate
          }}</ion-text>
        </div>
        <app-recovery-word-input></app-recovery-word-input>
        <div class="text1">
          <ion-text class="text1 ux-font-lato ux-fweight-regular ux-fsize-16">{{
            'wallets.verify-phrase.text1' | translate
          }}</ion-text>
        </div>
        <app-recovery-phrase-card class="card"></app-recovery-phrase-card>
      </div>
    </ion-content>
    <div class="ux_footer ion-padding">
      <div class="next_button">
        <ion-button class="ux_button" appTrackClick name="Next" type="submit" size="large">
          {{ 'wallets.recovery-phrase.btn_next' | translate }}
        </ion-button>
      </div>
    </div>
  `,
  styleUrls: ['./verify-phrase.page.scss'],
})
export class VerifyPhrasePage implements OnInit {
  constructor() {}

  ngOnInit() {}
}
