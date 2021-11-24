import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-recovery-phrase-no-wallet',
  template: `<ion-header>
      <ion-toolbar color="uxprimary" class="ux_toolbar">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/menus/main-menu"></ion-back-button>
        </ion-buttons>
        <ion-title>{{ 'wallets.recovery_phrase_information_no_wallet.header' | translate }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="rpnw ion-padding-start ion-padding-end">
      <div class="ux_main">
        <div class="ux_content">
          <div class="rpnw__img_container">
            <img class="rpnw__img_container__img" src="assets/img/wallets/wallet-security.svg" />
          </div>
          <div class="rpnw__content">
            <div class="ux-font-text-xs text1">
              <ion-text>{{ 'wallets.recovery_phrase_information_no_wallet.text1' | translate }}</ion-text>
            </div>
            <div class="ux-font-header-titulo text2">
              <ion-text>{{ 'wallets.recovery_phrase_information_no_wallet.text2' | translate }}</ion-text>
            </div>
            <div>
              <ion-text class="ux-font-text-xs text3">{{
                'wallets.recovery_phrase_information_no_wallet.text3' | translate
              }}</ion-text>
            </div>
            <div class="buttons">
              <ion-button
                class="ux_button"
                name="Go To Create Wallet"
                type="button"
                color="uxsecondary"
                expand="block"
                (click)="this.goToCreateWallet()"
                appTrackClick
              >
                {{ 'wallets.recovery_phrase_information_no_wallet.button_create' | translate }}
              </ion-button>
              <ion-button
                class="ux_button_outlined"
                name="Go To Import Wallet"
                type="button"
                expand="block"
                (click)="this.goToImportWallet()"
                appTrackClick
              >
                {{ 'wallets.recovery_phrase_information_no_wallet.button_import' | translate }}
              </ion-button>
            </div>
          </div>
        </div>
        <div class="rpnw__footer ux_footer">
          <ion-button
            class="ux-link-xs"
            name="Go To FAQ"
            type="button"
            fill="clear"
            (click)="this.goToFAQ()"
            appTrackClick
          >
            {{ 'wallets.recovery_phrase_information_no_wallet.button_faq' | translate }}
          </ion-button>
        </div>
      </div>
    </ion-content>`,
  styleUrls: ['./recovery-phrase-no-wallet.page.scss'],
})
export class RecoveryPhraseNoWalletPage implements OnInit {
  constructor(private navController: NavController) {}

  ngOnInit() {}

  goToImportWallet() {
    this.navController.navigateForward(['wallets/create-first/disclaimer', 'import']);
  }

  goToCreateWallet() {
    this.navController.navigateForward(['wallets/create-first/disclaimer']);
  }

  goToFAQ() {
    this.navController.navigateForward(['support/wallet']);
  }
}
