import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { WalletPasswordSmallComponent } from '../shared-wallets/components/wallet-password-small/wallet-password-small.component';

@Component({
  selector: 'app-recovery-phrase-information',
  template: `
    <ion-header>
      <ion-toolbar color="uxprimary" class="ux_toolbar">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/wallets/select-currency"></ion-back-button>
        </ion-buttons>
        <ion-title>{{ 'wallets.recovery-phrase-information.header' | translate }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="rpi ion-padding-start ion-padding-end">
      <div class="ux_main">
        <div class="ux_content">
          <div class="rpi__img_container">
            <img class="rpi__img_container__img" src="../../../../assets/img/wallets/lock-security-success.svg" />
          </div>
          <div class="rpi__list">
            <ion-list class="rpi__list__list">
              <ion-item class="rpi__list__list__item" lines="none">
                <ion-icon class="rpi__list__list__item__icon" name="ux-hand" color="uxprimary"></ion-icon>
                <ion-text class="rpi__list__list__item__text ux-font-text-base" color="uxdark">
                  {{ 'wallets.recovery-phrase-information.text1' | translate }}
                </ion-text>
              </ion-item>
              <ion-item class="rpi__list__list__item" lines="none">
                <ion-icon class="rpi__list__list__item__icon" name="ux-key-outline" color="uxprimary"></ion-icon>
                <ion-text class="rpi__list__list__item__text ux-font-text-base" color="uxdark">
                  {{ 'wallets.recovery-phrase-information.text2' | translate }}
                </ion-text>
              </ion-item>
              <ion-item class="rpi__list__list__item" lines="none">
                <ion-icon class="rpi__list__list__item__icon" name="ux-info-circle-alt" color="uxprimary"></ion-icon>
                <ion-text class="rpi__list__list__item__text ux-font-text-base" color="uxdark">
                  {{ 'wallets.recovery-phrase-information.text3' | translate }}
                </ion-text>
              </ion-item>
            </ion-list>
          </div>
        </div>
        <div class="rpi__footer ux_footer">
          <ion-button
            class="ux_button"
            name="Continue"
            type="button"
            color="uxsecondary"
            expand="block"
            size="large"
            (click)="this.continue()"
            appTrackClick
          >
            {{ 'wallets.recovery-phrase-information.button-text' | translate }}
          </ion-button>
        </div>
      </div>
    </ion-content>
  `,
  styleUrls: ['./recovery-phrase-information.page.scss'],
})
export class RecoveryPhraseInformationPage implements OnInit {
  constructor(private modalController: ModalController) {}

  ngOnInit() {}

  async continue() {
    const modal = await this.modalController.create({
      component: WalletPasswordSmallComponent,
      cssClass: 'ux-routeroutlet-modal full-screen-modal',
      swipeToClose: false,
    });

    await modal.present();
  }
}
