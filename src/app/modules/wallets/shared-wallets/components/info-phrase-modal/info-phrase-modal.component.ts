import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-info-phrase-modal',
  template: `
    <div class="main__close_button">
      <ion-button class="ion-no-padding" slot="icon-only" fill="clear" name="Close" (click)="this.close()">
        <ion-icon class="main__close_button__icon" name="ux-close" color="primary"></ion-icon>
      </ion-button>
    </div>
    <div class="main__body">
      <div class="header__ux_info_phrase_image">
        <img src="assets/img/wallets/info-phrase.svg" />
      </div>
      <div class="main__body__content">
        <ion-label class="ux-font-text-lg main__body__content__title"
          >{{ 'wallets.shared_wallets.recovery_phrase_info.title' | translate }}
        </ion-label>
        <ion-label color="primary" class="ion-no-margin ux-font-text-base main__body__content__description">
          {{ 'wallets.shared_wallets.recovery_phrase_info.description' | translate }}
        </ion-label>
      </div>
      <div class="main__actions">
        <ion-button
          class="ux_button main__actions__button"
          name="ux_phrase_information"
          color="secondary"
          expand="block"
          (click)="this.close()"
        >
          {{ 'wallets.shared_wallets.recovery_phrase_info.button_text' | translate }}
        </ion-button>
      </div>
    </div>
  `,
  styleUrls: ['./info-phrase-modal.component.scss'],
})
export class InfoPhraseModalComponent implements OnInit {
  constructor(private modalController: ModalController) {}

  ngOnInit() {}

  close() {
    this.modalController.dismiss();
  }
}
