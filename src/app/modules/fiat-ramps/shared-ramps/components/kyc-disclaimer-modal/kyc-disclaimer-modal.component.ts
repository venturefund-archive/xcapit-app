import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-kyc-disclaimer-modal',
  template: `
    <div class="kdm">
      <div class="kdm__close">
        <ion-button 
          fill="clear" 
          appTrackClick 
          name="ux_buy_kripton_exit" 
          (click)="this.close()">
          <ion-icon class="kdm__close__icon" name="ux-close" color="neutral80"></ion-icon>
        </ion-button>
      </div>
      <div class="ux_main ion-padding">
        <div class="ux_content">
          <div class="kdm__image">
            <img src="assets/img/fiat-ramps/kyc-disclaimer-modal/kyc-mobile.svg" />
          </div>
          <div class="kdm__title">
            <ion-text class="ux-font-text-xl" color="primary">
              {{ 'fiat_ramps.shared.kyc_disclaimer_modal.title' | translate }}
            </ion-text>
          </div>
          <div class="kdm__description">
            <ion-text class="ux-font-text-base ion-text-wrap">
              {{ 'fiat_ramps.shared.kyc_disclaimer_modal.description' | translate }}
            </ion-text>
          </div>
        </div>
        <div class="ux_footer kdm__begin">
          <ion-button
            appTrackClick
            (click)="this.close()"
            name="ux_buy_kripton_register"
            class="ux_button"
            type="button"
            color="secondary"
            size="large"
          >
          {{ 'fiat_ramps.shared.kyc_disclaimer_modal.button' | translate }}
          </ion-button>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./kyc-disclaimer-modal.component.scss'],
})
export class KycDisclaimerModalComponent implements OnInit {
  constructor(private modalController: ModalController) {}

  ngOnInit() {}

  close() {
    this.modalController.dismiss(false);
  }
}
