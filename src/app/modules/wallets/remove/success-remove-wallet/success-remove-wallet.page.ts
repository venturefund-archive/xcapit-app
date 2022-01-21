import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-success-remove-wallet',
  template: ` <ion-content class="srw ion-padding-start ion-padding-end">
    <div class="srw__button_content">
      <ion-button class="srw__close_button" appTrackClick fill="clear" name="close" (click)="this.goToHome()">
        <ion-icon class="srw__close_button__icon" name="ux-close" color="uxsemidark"></ion-icon>
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
              name="go-to-create-wallet"
              type="button"
              color="uxsecondary"
              expand="block"
              (click)="this.goToCreateWallet()"
              appTrackClick
            >
              {{ 'wallets.remove_success.create_button' | translate }}
            </ion-button>
            <ion-button
              class="ux-button-outlined"
              name="go-to-import-wallet"
              type="button"
              expand="block"
              (click)="this.goToImportWallet()"
              appTrackClick
            >
              {{ 'wallets.remove_success.import_button' | translate }}
            </ion-button>
            <ion-button
              class="ux-link-xl"
              name="go-to-home"
              type="button"
              fill="clear"
              (click)="this.goToHome()"
              appTrackClick
            >
              {{ 'wallets.remove_success.home_link' | translate }}
            </ion-button>
          </div>
        </div>
      </div>
    </div>
  </ion-content>`,
  styleUrls: ['./success-remove-wallet.page.scss'],
})
export class SuccessRemoveWalletPage implements OnInit {
  constructor(private navController: NavController) {}

  ngOnInit() {}

  goToCreateWallet() {
    this.navController.navigateForward(['/wallets/create-first/disclaimer']);
  }

  goToImportWallet() {
    this.navController.navigateForward(['/wallets/create-first/disclaimer/import']);
  }

  goToHome() {
    this.navController.navigateBack(['tabs/home']);
  }
}
