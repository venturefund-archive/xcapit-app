import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-recovery-phrase-information',
  template: `
    <ion-header>
      <ion-toolbar color="primary" class="ux_toolbar">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/profiles/menu"></ion-back-button>
        </ion-buttons>
        <ion-title>{{ 'wallets.recovery_phrase_information.header' | translate }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="rpi ion-padding-start ion-padding-end">
      <div class="ux_main">
        <div class="ux_content">
          <div class="rpi__img_container">
            <img class="rpi__img_container__img" src="assets/img/wallets/lock-security-success.svg" />
          </div>
          <div class="rpi__list">
            <ion-list class="rpi__list__list">
              <ion-item class="rpi__list__list__item" lines="none">
                <ion-icon
                  size="medium"
                  class="rpi__list__list__item__icon"
                  name="ux-hand"
                  color="primary"
                  slot="start"
                ></ion-icon>
                <ion-label class="rpi__list__list__item__text ux-font-text-base" color="neutral90">
                  {{ 'wallets.recovery_phrase_information.text1' | translate }}
                </ion-label>
              </ion-item>
              <ion-item class="rpi__list__list__item" lines="none">
                <ion-icon
                  size="medium"
                  class="rpi__list__list__item__icon"
                  name="ux-key-outline"
                  color="primary"
                  slot="start"
                ></ion-icon>
                <ion-label class="rpi__list__list__item__text ux-font-text-base" color="neutral90">
                  {{ 'wallets.recovery_phrase_information.text2' | translate }}
                </ion-label>
              </ion-item>
              <ion-item class="rpi__list__list__item" lines="none">
                <ion-icon
                  size="medium"
                  class="rpi__list__list__item__icon"
                  name="ux-info-circle-alt"
                  color="primary"
                  slot="start"
                ></ion-icon>
                <ion-label class="rpi__list__list__item__text ux-font-text-base" color="neutral90">
                  {{ 'wallets.recovery_phrase_information.text3' | translate }}
                </ion-label>
              </ion-item>
            </ion-list>
          </div>
        </div>
        <div class="rpi__footer ux_footer">
          <ion-button
            class="ux_button"
            name="ux_phrase_continue"
            type="button"
            color="secondary"
            expand="block"
            size="large"
            (click)="this.continue()"
            appTrackClick
          >
            {{ 'wallets.recovery_phrase_information.button_text' | translate }}
          </ion-button>
        </div>
      </div>
    </ion-content>
  `,
  styleUrls: ['./recovery-phrase-information.page.scss'],
})
export class RecoveryPhraseInformationPage implements OnInit {
  constructor(private navController: NavController) {}

  ngOnInit() {}

  continue() {
    this.navController.navigateForward(['/wallets/recovery/read']);
  }
}
