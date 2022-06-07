import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-info-phrase-advice-modal',
  template: ` <div class="main__close_button">
      <ion-button class="ion-no-padding" slot="icon-only" fill="clear" name="Close" (click)="this.close()">
        <ion-icon class="main__close_button__icon" name="ux-close"></ion-icon>
      </ion-button>
    </div>
    <div class="main__body">
     
        <img src="assets/img/wallets/info-phrase-advice.svg" />
     
      <div class="main__body__content">
        <ion-label class="ux-font-text-lg main__body__content__title"
          >{{ 'wallets.shared_wallets.info_phrase_advice_modal.title' | translate }}
        </ion-label>
        <ion-label class="ion-no-margin ux-font-text-base main__body__content__description">
          {{ 'wallets.shared_wallets.info_phrase_advice_modal.description' | translate }}
        </ion-label>
        <div class= "main__body__content__list">
          <ul class="ux-font-text-base main__body__content__list__items">
            <li *ngFor="let item of this.items">
              {{ item.description | translate }}
            </li>
          </ul>
        </div>
        <div class="main__actions">
          <ion-button
            class="ux_button main__actions__button ion-no-margin"
            name="Understood"
            color="secondary"
            size="large"
            (click)="this.close()"
          >
            {{ 'wallets.shared_wallets.info_phrase_advice_modal.button_text' | translate }}
          </ion-button>
        </div>
      </div>
    </div>`,
  styleUrls: ['./info-phrase-advice-modal.component.scss'],
})
export class InfoPhraseAdviceModalComponent implements OnInit {
  items = [
    { description: 'wallets.shared_wallets.info_phrase_advice_modal.item_1' },
    { description: 'wallets.shared_wallets.info_phrase_advice_modal.item_2' },
    { description: 'wallets.shared_wallets.info_phrase_advice_modal.item_3' },
    { description: 'wallets.shared_wallets.info_phrase_advice_modal.item_4' },
    { description: 'wallets.shared_wallets.info_phrase_advice_modal.item_5' },
  ];
  constructor(private modalController: ModalController) {}

  ngOnInit() {}

  close() {
    this.modalController.dismiss();
  }
}
