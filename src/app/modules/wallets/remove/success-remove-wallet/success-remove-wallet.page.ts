import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-success-remove-wallet',
  template: ` <ion-content class="srw ion-padding-start ion-padding-end">
    <div class="srw__button_content">
      <ion-button class="srw__close_button" appTrackClick fill="clear" name="close" (click)="this.goToOnboarding()">
        <ion-icon class="srw__close_button__icon" name="ux-close" color="neutral80"></ion-icon>
      </ion-button>
    </div>
    <div class="ux_main">
      <div class="ux_content">
        <div class="srw__img_container">
          <img class="srw__img_container__img" src="assets/img/wallets/success-remove.svg" />
        </div>
        <div class="srw__content">
          <div class="ux-font-text-xl title">
            <ion-text>{{ 'wallets.remove_success.title' | translate }}</ion-text>
          </div>
          <div>
            <ion-text class="ux-font-text-base-black subtitle">{{
              'wallets.remove_success.subtitle' | translate
            }}</ion-text>
          </div>
          <div class="buttons">
            <ion-button
              class="ux_button"
              name="go_to_create_wallet"
              type="button"
              color="secondary"
              expand="block"
              (click)="this.goToCreateDisclaimer()"
              appTrackClick
            >
              {{ 'wallets.remove_success.create_button' | translate }}
            </ion-button>
            <ion-button
              class="ux-button-outlined"
              name="go_to_import_wallet"
              type="button"
              expand="block"
              (click)="this.goToImportDisclaimer()"
              appTrackClick
            >
              {{ 'wallets.remove_success.import_button' | translate }}
            </ion-button>
          </div>
        </div>
      </div>
    </div>
  </ion-content>`,
  styleUrls: ['./success-remove-wallet.page.scss'],
})
export class SuccessRemoveWalletPage {
  constructor(private navController: NavController) {}

  goToCreateDisclaimer() {
    this.navController.navigateRoot('/wallets/select-wallet-type');
  }
  goToImportDisclaimer() {
    this.navController.navigateRoot('/wallets/create-first/disclaimer/import');
  }

  goToOnboarding() {
    this.navController.navigateRoot('/users/on-boarding');
  }
}
