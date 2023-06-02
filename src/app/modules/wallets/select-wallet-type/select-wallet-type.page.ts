import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { WalletInitializeProcess } from '../shared-wallets/services/wallet-initialize-process/wallet-initialize-process';

@Component({
  selector: 'app-select-wallet-type',
  template: `
    <div class="bg">
      <div class="bg__close_button">
        <ion-button
          name="Close button"
          class="bg__close ion-no-padding"
          slot="icon-only"
          fill="clear"
          color="white"
          (click)="this.close()"
        >
          <ion-icon class="bg__close_button__icon" name="ux-close"></ion-icon>
        </ion-button>
      </div>
    </div>
    <ion-content class="swt ion-padding">
      <div class="swt__content">
        <div class="swt__content__header">
          <div class="swt__content__header__title">
            <ion-text class="ux-font-text-xl">
              {{ 'wallets.select_wallet_type.title' | translate }}
            </ion-text>
          </div>
        </div>
        <div class="swt__content__button">
          <div
            class="swt__content__button__card ux-card no-border"
            appTrackClick
            name="ux_create_select_warrant"
            (click)="this.warrantyWallet()"
          >
            <div class="swt__content__button__card__icon">
              <img src="assets/ux-icons/ux-logo-naranjax.svg" />
            </div>
            <div class="swt__content__button__card__content">
              <div class="swt__content__button__card__content__title">
                <ion-text class="ux-font-text-lg">
                  {{ 'wallets.select_wallet_type.warranty_wallet.title' | translate }}
                </ion-text>
              </div>
              <div class="swt__content__button__card__content__description">
                <ion-text class="ux-font-text-xxs">
                  {{ 'wallets.select_wallet_type.warranty_wallet.description' | translate }}
                </ion-text>
              </div>
            </div>
            <div class="swt__content__button__card__chevron">
              <ion-icon name="chevron-forward-outline" color="info"></ion-icon>
            </div>
          </div>
          <div
            class="swt__content__button__card ux-card no-border"
            appTrackClick
            name="ux_create_select_web3"
            (click)="this.web3Wallet()"
          >
            <div class="swt__content__button__card__icon">
              <img src="assets/ux-icons/ux-checked-info.svg" />
            </div>
            <div class="swt__content__button__card__content">
              <div class="swt__content__button__card__content__title">
                <ion-text class="ux-font-text-lg">
                  {{ 'wallets.select_wallet_type.web3_wallet.title' | translate }}
                </ion-text>
              </div>
              <div class="swt__content__button__card__content__description">
                <ion-text class="ux-font-text-xxs">
                  {{ 'wallets.select_wallet_type.web3_wallet.description' | translate }}
                </ion-text>
              </div>
            </div>
            <div class="swt__content__button__card__chevron">
              <ion-icon name="chevron-forward-outline" color="info"></ion-icon>
            </div>
          </div>
        </div>
      </div>
    </ion-content>
    <ion-footer class="swt__footer">
      <div class="swt__footer__support">
        <app-whatsapp-support></app-whatsapp-support>
      </div>
    </ion-footer>
  `,
  styleUrls: ['./select-wallet-type.page.scss'],
})
export class SelectWalletTypePage {
  constructor(private navController: NavController, private walletInitializeProcessService: WalletInitializeProcess) {}

  async warrantyWallet(): Promise<void> {
    this.walletInitializeProcessService.setWarrantyWallet(true);
    this._goToPasswordCreation();
  }

  async web3Wallet(): Promise<void> {
    this.walletInitializeProcessService.setWarrantyWallet(false);
    this._goToPasswordCreation();
  }

  private _goToPasswordCreation(): void {
    this.navController.navigateForward(['wallets/steps-naranjax']);
  }

  close(): void {
    this.navController.navigateBack(['users/on-boarding']);
  }
}
