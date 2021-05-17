import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-informative-modal',
  template: `
    <div class="im__content__img">
      <img src="assets/img/apikeys/no-apikey.svg" />
    </div>
    <div class="im__content__title">
      <ion-text class="ux-font-lato ux-fweight-bold ux-fsize-15">
        {{ 'fiat_ramps.wallet_comprobation.title' | translate }}
      </ion-text>
    </div>
    <div class="im__content__message">
      <ion-text class="ux-font-lato ux-fweight-regular ux-fsize-14">
        {{ 'fiat_ramps.wallet_comprobation.message' | translate }}
      </ion-text>
    </div>
    <div class="im__content__buttons">
      <div class="im__content__button__back">
        <ion-button
          appTrackClick
          name="method"
          fill="clear"
          color="uxsecondary"
          size="small"
          slot="end"
          class="ux-font-lato ux-fweight-regular ux-fsize-14"
        >
          {{ 'fiat_ramps.wallet_comprobation.btn_back' | translate }}
        </ion-button>
      </div>
      <div class="im__content__button__add">
        <ion-button
          appTrackClick
          name="method"
          fill="clear"
          color="uxsecondary"
          size="small"
          slot="end"
          class="ux-font-lato ux-fweight-bold ux-fsize-14"
        >
          {{ 'fiat_ramps.wallet_comprobation.btn_add_apikey' | translate }}
        </ion-button>
      </div>
    </div>
  `,
  styleUrls: ['./informative-modal.component.scss'],
})
export class InformativeModalComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
