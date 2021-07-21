import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

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
        <div class="title">
          <ion-text class="ux-font-gilroy ux-fweight-extrabold ux-fsize-22">{{
            'wallets.recovery-phrase.title' | translate
          }}</ion-text>
        </div>
        <div class="text1">
          <ion-text class="text1 ux-font-lato ux-fweight-regular ux-fsize-16">{{
            'wallets.recovery-phrase.text1' | translate
          }}</ion-text>
        </div>
        <div class="text2">
          <ion-text class="text2 ux-font-lato ux-fweight-regular ux-fsize-16">{{
            'wallets.recovery-phrase.text2' | translate
          }}</ion-text>
        </div>
        <div class="text3">
          <ion-text class="text3 ux-font-lato ux-fweight-regular ux-fsize-16">{{
            'wallets.recovery-phrase.text3' | translate
          }}</ion-text>
        </div>
        <div class="text4">
          <ion-text class="text4 ux-font-lato ux-fweight-regular ux-fsize-16">{{
            'wallets.recovery-phrase.text4' | translate
          }}</ion-text>
        </div>
        <app-recovery-phrase-card class="card"></app-recovery-phrase-card>
      </div>
    </ion-content>
    <div class="ux_footer ion-padding">
      <div class="next_button">
        <ion-button class="ux_button" appTrackClick name="Next" type="submit" size="large" (click)="goToVerifyPhrase()">
          {{ 'wallets.recovery-phrase.btn_next' | translate }}
        </ion-button>
      </div>
    </div>
  `,
  styleUrls: ['./recovery-phrase.page.scss'],
})
export class RecoveryPhrasePage implements OnInit {
  constructor(private navController: NavController) {}

  ngOnInit() {}

  goToVerifyPhrase() {
    this.navController.navigateForward(['/wallets/create-first/verify-phrase']);
  }
}
