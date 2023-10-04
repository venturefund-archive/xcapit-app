import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { StorageService } from '../../shared-wallets/services/storage-wallets/storage-wallets.service';
import { WalletConnectService } from '../../shared-wallets/services/wallet-connect/wallet-connect.service';
import { IonicStorageService } from 'src/app/shared/services/ionic-storage/ionic-storage.service';
import { TxInProgressService } from 'src/app/modules/swaps/shared-swaps/services/tx-in-progress/tx-in-progress.service';
import { NotificationsService } from '../../../notifications/shared-notifications/services/notifications/notifications.service';
import { ActiveLender } from 'src/app/shared/models/active-lender/active-lender';

@Component({
  selector: 'app-remove-wallet',
  template: `<ion-header>
      <ion-toolbar color="primary" class="ux_toolbar">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/profile/menu"></ion-back-button>
        </ion-buttons>
        <ion-title>{{ 'wallets.remove.header' | translate }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="rw ion-padding-start ion-padding-end">
      <div class="ux_main">
        <div class="ux_content">
          <div class="rw__img-container">
            <img class="rw__img-container__img" src="assets/img/wallets/remove.svg" />
          </div>
          <div class="rw__title ux-font-text-lg">
            <ion-text>{{ 'wallets.remove.title' | translate }}</ion-text>
          </div>
          <div class="rw__list">
            <ion-list class="rw__list">
              <ion-item class="rw__list__item" lines="none">
                <ion-icon
                  size="medium"
                  class="rw__list__item__icon"
                  name="ux-hand"
                  color="primary"
                  slot="start"
                ></ion-icon>
                <ion-label class="rw__list__item__text ux-font-text-base-primary" color="neutral90">
                  {{ 'wallets.remove.item1' | translate }}
                </ion-label>
              </ion-item>
              <ion-item class="rw__list__item" lines="none">
                <ion-icon
                  size="medium"
                  class="rw__list__item__icon"
                  name="ux-key-outline"
                  color="primary"
                  slot="start"
                ></ion-icon>
                <ion-label class="rw__list__item__text ux-font-text-base-primary" color="neutral90">
                  {{ 'wallets.remove.item2' | translate }}
                </ion-label>
              </ion-item>
              <ion-item class="rw__list__item" lines="none">
                <ion-icon
                  size="medium"
                  class="rw__list__item__icon"
                  name="ux-wallet"
                  color="primary"
                  slot="start"
                ></ion-icon>
                <ion-label class="rw__list__item__text ux-font-text-base-primary" color="neutral90">
                  {{ 'wallets.remove.item3' | translate }}
                </ion-label>
              </ion-item>
              <ion-item class="last ux-font-text-xs">
                <ion-label>
                  {{ 'wallets.remove.tos' | translate }}
                </ion-label>
                <ion-checkbox
                  mode="md"
                  slot="start"
                  name="checkbox-condition"
                  (ionChange)="this.toggleButton()"
                ></ion-checkbox>
              </ion-item>
            </ion-list>
          </div>
        </div>
        <div class="rw__footer ux_footer">
          <ion-button
            [disabled]="!this.acceptTos"
            class="ux_button"
            name="remove_wallet"
            type="button"
            color="secondary"
            expand="block"
            size="large"
            (click)="this.remove()"
            appTrackClick
            [appLoading]="this.loading"
            [loadingText]="'wallets.remove.loading' | translate"
          >
            {{ 'wallets.remove.button_text' | translate }}
          </ion-button>
        </div>
      </div>
    </ion-content>`,
  styleUrls: ['./remove-wallet.page.scss'],
})
export class RemoveWalletPage {
  acceptTos = false;
  loading = false;
  private _lenderName: string;

  constructor(
    private navController: NavController,
    private storageService: StorageService,
    private walletConnectService: WalletConnectService,
    private ionicStorageService: IonicStorageService,
    private txInProgressService: TxInProgressService,
    private notificationsService: NotificationsService
  ) {}

  async remove() {
    this._enableLoading();
    await this.storageService.removeWalletFromStorage();
    await this._backupLender();
    this._cleanStorage();
    await this.walletConnectService.killSession();
    await this._goToSuccessPage();
    this._disableLoading();
    await this._removeInProgressTransactions();
    this.notificationsService.getInstance().clearRegistration();
    this._restoreLender();
  }

  private async _backupLender() {
    this._lenderName = await new ActiveLender(this.ionicStorageService).name();
  }

  private async _restoreLender(): Promise<void> {
    await new ActiveLender(this.ionicStorageService).save(this._lenderName);
  }

  private _enableLoading(): void {
    this.loading = true;
  }

  private _disableLoading(): void {
    this.loading = false;
  }

  private _goToSuccessPage(): Promise<boolean> {
    return this.navController.navigateForward(['wallets/remove/success']);
  }

  toggleButton(): boolean {
    return (this.acceptTos = !this.acceptTos);
  }

  private _cleanStorage() {
    this.ionicStorageService.clear();
  }

  private async _removeInProgressTransactions() {
    await this.txInProgressService.clean();
  }
}
