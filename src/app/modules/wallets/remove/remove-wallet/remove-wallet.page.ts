import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { StorageService } from '../../shared-wallets/services/storage-wallets/storage-wallets.service';

@Component({
  selector: 'app-remove-wallet',
  template: `<ion-header>
      <ion-toolbar color="uxprimary" class="ux_toolbar">
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
                  color="uxprimary"
                  slot="start"
                ></ion-icon>
                <ion-label class="rw__list__item__text ux-font-text-base-primary" color="uxdark">
                  {{ 'wallets.remove.item1' | translate }}
                </ion-label>
              </ion-item>
              <ion-item class="rw__list__item" lines="none">
                <ion-icon
                  size="medium"
                  class="rw__list__item__icon"
                  name="ux-key-outline"
                  color="uxprimary"
                  slot="start"
                ></ion-icon>
                <ion-label class="rw__list__item__text ux-font-text-base-primary" color="uxdark">
                  {{ 'wallets.remove.item2' | translate }}
                </ion-label>
              </ion-item>
              <ion-item class="rw__list__item" lines="none">
                <ion-icon
                  size="medium"
                  class="rw__list__item__icon"
                  name="ux-wallet"
                  color="uxprimary"
                  slot="start"
                ></ion-icon>
                <ion-label class="rw__list__item__text ux-font-text-base-primary" color="uxdark">
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
            color="uxsecondary"
            expand="block"
            size="large"
            (click)="this.remove()"
            appTrackClick
          >
            {{ 'wallets.recovery_phrase_information.button_text' | translate }}
          </ion-button>
        </div>
      </div>
    </ion-content>`,
  styleUrls: ['./remove-wallet.page.scss'],
})
export class RemoveWalletPage implements OnInit {
  acceptTos = false;

  constructor(private navController: NavController, private storageService: StorageService) {}

  ngOnInit() {}

  remove() {
    this.storageService.removeWalletFromStorage();
    this.goToSuccessPage();
  }

  enableButton() {
    return (this.acceptTos = !this.acceptTos);
  }

  goToSuccessPage() {
    this.navController.navigateForward(['wallets/remove/success']);
  }
}
