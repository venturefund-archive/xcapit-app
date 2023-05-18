import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-provider-fee-info-modal',
  template: `
    <div class="modal-content">
      <div class="pfim__close-button">
        <ion-button class="ion-no-padding" slot="icon-only" fill="clear" name="Close" (click)="this.close()">
          <ion-icon class="pfim__close-button__icon" name="ux-close"></ion-icon>
        </ion-button>
      </div>
      <div class="pfim__body ion-padding">
        <div class="pfim__body__content">
          <div class="pfim__body__content__img">
            <img src="assets/img/provider-logos/KriptonMarket.svg" />
          </div>
          <div class="pfim__body__content__title">
            <ion-text class="ux-font-text-xl"
              >{{ 'fiat_ramps.select_provider.modal_info.kripton.provider_name' | translate }}
            </ion-text>
          </div>
          <div class="pfim__body__content__header">
            <ion-text class="ux-font-text-lg">
              {{ 'fiat_ramps.shared.provider_fee_info_modal.title' | translate }}
            </ion-text>
          </div>
          <div class="pfim__body__content__description">
            <ion-text class="ux-font-text-base">
              {{ 'fiat_ramps.shared.provider_fee_info_modal.item1' | translate }}
            </ion-text>
            <br />
            <ion-text class="ux-font-text-base">
              {{ 'fiat_ramps.shared.provider_fee_info_modal.item2' | translate }}
            </ion-text>
          </div>
          <div class="pfim__actions">
            <ion-button
              class="ux_button pfim__actions__button ion-no-margin"
              name="Understood"
              color="secondary"
              size="large"
              (click)="this.close()"
            >
              {{ 'fiat_ramps.shared.fee_info_modal.button' | translate }}
            </ion-button>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./provider-fee-info-modal.component.scss'],
})
export class ProviderFeeInfoModalComponent implements OnInit {
  constructor(private modalController: ModalController) {}

  ngOnInit() {}

  close() {
    this.modalController.dismiss();
  }
}
