import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-account-recovery-info',
  template: `<ion-header>
      <ion-toolbar color="primary" class="ux_toolbar ux_toolbar__rounded">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="tabs/home"></ion-back-button>
        </ion-buttons>
        <ion-title> {{ 'users.account_recovery_info.header' | translate }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ari ion-padding">
      <div class="ux_main">
        <div class="ari__title">
          <ion-text class="ux-font-text-lg">{{ 'users.account_recovery_info.title' | translate }} </ion-text>
        </div>
        <div class="ari__items">
          <div class="ari__items__item">
            <img src="assets/ux-icons/ux-import-wallet-infolight.svg" />
            <ion-text class="ux-font-text-base" color="neutral90">
              {{ 'users.account_recovery_info.item_1' | translate }}
            </ion-text>
          </div>
          <div class="ari__items__item">
            <img src="assets/ux-icons/ux-terms-infolight.svg" />
            <ion-text class="ux-font-text-base" color="neutral90"
              >{{ 'users.account_recovery_info.item_2' | translate }}
            </ion-text>
          </div>
          <div class="ari__items__item">
            <img src="assets/ux-icons/ux-bookmark-infolight.svg" />
            <ion-text class="ux-font-text-base" color="neutral90"
              >{{ 'users.account_recovery_info.item_3' | translate }}
            </ion-text>
          </div>
        </div>
        <div class="ari__footer">
          <div class="ari__footer__import">
            <ion-button
              appTrackClick
              class="ux_button ari__footer__import__button"
              name="ux_recover_wallet"
              color="secondary"
              expand="block"
              (click)="this.goToRecoveryWallet()"
              >{{ 'users.account_recovery_info.button_primary' | translate }}</ion-button
            >
          </div>
          <div class="ari__footer__no-phrase">
            <ion-button
              appTrackClick
              class="ux-button-outlined ari__footer__no-phrase__button"
              name="ux_recover_no_phrase"
              expand="block"
              (click)="this.goToAccountRecovery()"
              >{{ 'users.account_recovery_info.button_secondary' | translate }}</ion-button
            >
          </div>
        </div>
      </div>
    </ion-content> `,
  styleUrls: ['./account-recovery-info.page.scss'],
})
export class AccountRecoveryInfoPage implements OnInit {
  constructor(private navController: NavController) {}

  ngOnInit() {}

  goToRecoveryWallet() {
    this.navController.navigateForward(['/wallets/create-first/disclaimer/import']);
  }

  goToAccountRecovery() {
    this.navController.navigateForward(['/users/account-recovery']);
  }
}
