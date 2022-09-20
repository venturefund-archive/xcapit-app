import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-fee-info-modal',
  template: ` <div class="modal-content">
    <div class="fim__close-button">
      <ion-button class="ion-no-padding" slot="icon-only" fill="clear" name="Close" (click)="this.close()">
        <ion-icon class="fim__close-button__icon" name="ux-close"></ion-icon>
      </ion-button>
    </div>
    <div class="fim__bodyion-padding">
      <div class="fim__body__content">
        <ion-text class="ux-font-text-lg fim__body__content__title">
          {{ 'fiat_ramps.shared.fee_modal_info.title' | translate }}
        </ion-text>
        <div class="fim__body__content__items">
          <ul>
            <li>{{ 'fiat_ramps.shared.fee_modal_info.item1' | translate }}</li>
            <li>{{ 'fiat_ramps.shared.fee_modal_info.item2' | translate }}</li>
            <li>{{ 'fiat_ramps.shared.fee_modal_info.item3' | translate }}</li>
          </ul>
        </div>
        <div class="fim__actions">
          <ion-button
            class="ux_button fim__actions__button ion-no-margin"
            name="Understood"
            color="secondary"
            size="large"
            (click)="this.close()"
          >
            {{ 'fiat_ramps.shared.fee_modal_info.button' | translate }}
          </ion-button>
        </div>
      </div>
    </div>
  </div>`,
  styleUrls: ['./fee-info-modal.component.scss'],
})
export class FeeInfoModalComponent implements OnInit {
  title: string;
  description: string;
  buttonText: string;

  constructor(private modalController: ModalController) {}

  ngOnInit() {}

  close() {
    this.modalController.dismiss();
  }
}
