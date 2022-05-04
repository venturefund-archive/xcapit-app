import { QueueService } from './../../../../shared/services/queue/queue.service';
import { BalanceCacheService } from './../../shared-wallets/services/balance-cache/balance-cache.service';
import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { StorageService } from '../../shared-wallets/services/storage-wallets/storage-wallets.service';
import { WalletConnectService } from '../../shared-wallets/services/wallet-connect/wallet-connect.service';

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
                  (ionChange)="this.enableButton()"
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
export class RemoveWalletPage implements OnInit {
  acceptTos = false;
  loading = false;

  constructor(
    private navController: NavController,
    private storageService: StorageService,
    private balanceCacheService: BalanceCacheService,
    private queueService: QueueService,
    private walletConnectService: WalletConnectService,
  ) {}

  ngOnInit() {}

  async remove() {
    this.loading = true;
    this.storageService.removeWalletFromStorage();
    this.queueService.dequeueAll();
    this.balanceCacheService.removeTotal();
    await this.walletConnectService.killSession();
    this.goToSuccessPage();
  }

  enableButton() {
    return (this.acceptTos = !this.acceptTos);
  }

  goToSuccessPage() {
    this.loading = false;
    this.navController.navigateForward(['wallets/remove/success']);
  }
}
