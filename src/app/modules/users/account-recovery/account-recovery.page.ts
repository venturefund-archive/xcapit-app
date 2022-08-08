import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { LINKS } from 'src/app/config/static-links';
import { BrowserService } from 'src/app/shared/services/browser/browser.service';
@Component({
  selector: 'app-account-recovery',
  template: `<ion-header>
      <ion-toolbar color="primary" class="ux_toolbar">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="tabs/home"></ion-back-button>
        </ion-buttons>
        <ion-title> {{ 'users.account_recovery.header' | translate }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding ar__content">
      <div class="ar__content__alert">
        <app-information-alert [text]="'users.account_recovery.alert'"></app-information-alert>
      </div>
      <div class="ar__content__link">
        <ion-label class="ar__content__link__phrase">
          <ion-label class="ux-font-text-xs"> {{ 'users.account_recovery.link.label' | translate }}</ion-label>
          <div class="ar__content__link__phrase__button">
            <ion-button
              name="go_to_privacy_policy"
              class="ux-link-xs ar__content__link__phrase__button__click"
              (click)="this.goToPrivacyPolicy()"
              appTrackClick
              fill="clear"
            >
              {{ 'users.account_recovery.link.privacy_policy' | translate }}
            </ion-button>
          </div>
        </ion-label>
      </div>
      <div class="ar__content__title">
        <ion-text class="ux-font-text-lg">
          {{ 'users.account_recovery.title' | translate }}
        </ion-text>
      </div>
      <div class="ar__content__card">
        <app-help-item-card *ngFor="let item of items" [item]="item"> </app-help-item-card>
      </div>
    </ion-content>
    <ion-footer>
      <div class="ar__footer__help-button">
        <ion-button appTrackClick name="ux_go_to_help" class="ar__footer__help-button__link ux-link-xl" (click)="this.goToHelp()" fill="clear" size="small">
          <ion-icon slot="start" name="ux-lifeguard"></ion-icon>
          {{ 'users.account_recovery.help_link' | translate }}</ion-button
        >
      </div>
    </ion-footer>`,
  styleUrls: ['./account-recovery.page.scss'],
})
export class AccountRecoveryPage implements OnInit {
  url = LINKS.xcapitPrivacyPolicy;
  items = [
    {
      title: 'users.account_recovery.item_1.title',
      description: 'users.account_recovery.item_1.description',
      icon: 'assets/ux-icons/ux-wallet-infolight.svg',
      route: '/wallets/create-first/disclaimer',
      dataToTrack:'ux_go_to_create'
    },
    {
      title: 'users.account_recovery.item_2.title',
      description: 'users.account_recovery.item_2.description',
      icon: 'assets/ux-icons/ux-import-wallet-infolight.svg',
      route: '/wallets/create-first/disclaimer/import',
      dataToTrack:'ux_go_to_import'
    },
  ];

  constructor(private browserService: BrowserService, private navController: NavController) {}

  ngOnInit() {}

  goToPrivacyPolicy() {
    this.browserService.open({ url: this.url });
  }

  goToHelp(): void {
    this.navController.navigateForward('/support/options');
  }
}
