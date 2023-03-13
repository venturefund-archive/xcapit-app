import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-bitrefill-info',
  template: `
    <div>
      <div class="main__close_button">
        <ion-button
          class="ion-no-padding"
          slot="icon-only"
          fill="clear"
          name="Close"
          appTrackClick
          (click)="this.close()"
        >
          <ion-icon class="main__close_button__icon" name="ux-close"></ion-icon>
        </ion-button>
      </div>
      <div class="main__body">
        <div class="main__body__content">
          <div class="main__body__content__img">
            <img src="assets/img/provider-logos/Bitrefill.svg" />
          </div>
          <div class="main__body__content__title">
            <ion-text class="ux-font-text-xl">{{ 'fiat_ramps.select_provider.modal_info.bitrefill.name' | translate }} </ion-text>
          </div>
          <div class="ux-text-base main__body__content__header">
            <ion-text>{{ 'fiat_ramps.select_provider.modal_info.bitrefill.header' | translate }}</ion-text>
            <br />
            <ion-text>{{ 'fiat_ramps.select_provider.modal_info.kyc_required' | translate }}</ion-text>
          </div>
          <div class="ux-font-header-titulo main__body__content__subtitle">
            <ion-text>{{ 'fiat_ramps.select_provider.modal_info.subtitle_available_tokens' | translate }}</ion-text>
          </div>
          <div class="main__body__content__description">
            <div class="main__body__content__description__tokens" >
              <ion-text>{{'fiat_ramps.select_provider.modal_info.bitrefill.erc20_tokens' | translate}}</ion-text>
              <app-token-network-badge [blockchainName]="'ERC20'"></app-token-network-badge>
            </div>
            <div class="main__body__content__description__tokens" >
              <ion-text>{{'fiat_ramps.select_provider.modal_info.bitrefill.polygon_tokens' | translate }}</ion-text>
              <app-token-network-badge [blockchainName]="'MATIC'"></app-token-network-badge>
            </div>
          </div>
          <div class="ux-font-header-titulo main__body__content__subtitle">
            <ion-text>{{ 'fiat_ramps.select_provider.modal_info.subtitle_payment_methods' | translate }}</ion-text>
          </div>
          <div class="main__body__content__description">
            <ion-text>{{'fiat_ramps.select_provider.modal_info.bitrefill.credit_card' | translate }}</ion-text>
          </div>
          <div class="ux-font-header-titulo main__body__content__subtitle">
            <ion-text>{{ 'fiat_ramps.select_provider.modal_info.subtitle_delivery_time' | translate }}</ion-text>
          </div>
          <div class="main__body__content__description">
            <ion-text>{{'fiat_ramps.select_provider.modal_info.bitrefill.delivery_time' | translate }}</ion-text>
          </div>
          <div class="main__body__content__disclaimer">
              <ion-text class="ux-font-text-xxs">{{ 'fiat_ramps.select_provider.modal_info.bitrefill.disclaimer' | translate }} </ion-text>
          </div>
          <div class="main__actions">
            <ion-button
              class="ux_button main__actions__button ion-no-margin"
              name="Understood"
              color="secondary"
              size="large"
              (click)="this.close()"
            >
              {{ 'fiat_ramps.select_provider.modal_info.button' | translate }}
            </ion-button>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./bitrefill-info.component.scss'],
})
export class BitrefillInfoComponent implements OnInit {
  constructor(private modalController : ModalController) {}

  ngOnInit() {}

  close() {
    this.modalController.dismiss();
  }
}
