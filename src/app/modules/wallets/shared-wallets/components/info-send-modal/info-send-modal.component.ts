import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-info-send-modal',
  template: `<div class="main__close_button">
  <ion-button class="ion-no-padding" slot="icon-only" fill="clear" name="Close" (click)="this.close()">
    <ion-icon class="main__close_button__icon" name="ux-close"></ion-icon>
  </ion-button>
</div>
<div class="main__body">
  <div class="main__body__content">
    <ion-label class="ux-font-text-lg main__body__content__title" 
      >{{
            (this.isAmountSend
              ? 'wallets.shared_wallets.info_send_modal.title_send_amount'
              : 'wallets.shared_wallets.info_send_modal.title_transaction_fee'
            ) | translate
          }}
    </ion-label>
    <ion-label class="ion-no-margin ux-font-text-base main__body__content__description">
      {{ 'wallets.shared_wallets.info_send_modal.description' | translate }}
    </ion-label>
    <div class="main__actions">
      <ion-button
        class="ux_button main__actions__button ion-no-margin"
        name="Understood"
        color="secondary"
        size="large"
        (click)="this.close()"
      >
        {{ 'wallets.shared_wallets.info_send_modal.button_text' | translate }}
      </ion-button>
    </div>
  </div>
</div>`,
  styleUrls: ['./info-send-modal.component.scss'],
})
export class InfoSendModalComponent implements OnInit {
  isAmountSend: boolean;
  constructor(private modalController: ModalController) { }

  ngOnInit() {}

  close() {
    this.modalController.dismiss();
  }
}
