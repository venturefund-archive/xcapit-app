import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-info-provider-moonpay',
  template: `
    <div class="modal-content">
      <div class="main">
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
              <img src="assets/img/provider-logos/Moonpay.svg" />
            </div>
            <div class="main__body__content__title">
              <ion-text class="ux-font-text-xl"
                >{{ 'fiat_ramps.select_provider.modal_info.moonpay.provider_name' | translate }}
              </ion-text>
            </div>

            <div class="ux-text-base main__body__content__header">
              <ion-text>{{ 'fiat_ramps.select_provider.modal_info.moonpay.header' | translate }}</ion-text>
              <br />
              <ion-text>{{ 'fiat_ramps.select_provider.modal_info.kyc_required' | translate }}</ion-text>
            </div>
            <div class="ux-font-header-titulo main__body__content__subtitle">
              <ion-text>{{ 'fiat_ramps.select_provider.modal_info.subtitle_available_tokens' | translate }}</ion-text>
            </div>
            <div class="main__body__content__description">
              <div class="main__body__content__description__badge">
                <ion-text class="ux-font-text-base">
                  {{ 'fiat_ramps.select_provider.modal_info.moonpay.available_tokens_1' | translate }}
                </ion-text>
                <ion-badge class="ux-badge ux-font-num-subtitulo" color="alt-2-light"> ERC20 </ion-badge>
              </div>
              <div class="main__body__content__description__badge">
                <ion-text class="ux-font-text-base">
                  {{ 'fiat_ramps.select_provider.modal_info.moonpay.available_tokens_2' | translate }}
                </ion-text>
                <ion-badge class="ux-badge ux-font-num-subtitulo" color="alt-3-light"> POLYGON </ion-badge>
              </div>
            </div>
            <div class="ux-font-header-titulo main__body__content__subtitle">
              <ion-text>{{ 'fiat_ramps.select_provider.modal_info.subtitle_payment_methods' | translate }}</ion-text>
            </div>
            <div class="main__body__content__description">
              <ion-text class="ux-font-text-base">
                {{ 'fiat_ramps.select_provider.modal_info.moonpay.payment_methods' | translate }}
              </ion-text>
            </div>
            <div class="ux-font-header-titulo main__body__content__subtitle">
              <ion-text>{{ 'fiat_ramps.select_provider.modal_info.subtitle_delivery_time' | translate }}</ion-text>
            </div>
            <div class="main__body__content__description">
              <ion-text class="ux-font-text-base">
                {{ 'fiat_ramps.select_provider.modal_info.moonpay.delivery_time' | translate }}
              </ion-text>
            </div>
            <div class="main__body__content__disclaimer">
              <ion-text class="ux-font-text-xxs">
                {{ 'fiat_ramps.select_provider.modal_info.moonpay.disclaimer' | translate }}
              </ion-text>
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
    </div>
  `,
  styleUrls: ['./info-provider-moonpay.component.scss'],
})
export class InfoProviderMoonpayComponent {
  constructor(private modalController: ModalController) {}

  close() {
    this.modalController.dismiss();
  }
}
