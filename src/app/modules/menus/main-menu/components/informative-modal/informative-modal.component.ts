import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-informative-modal',
  template: `
    <div class="im__content__img">
      <img src="assets/img/apikeys/no-apikey.svg" />
    </div>
    <div class="im__content__title">
      <ion-text class="ux-font-text-lg">
        {{ 'fiat_ramps.wallet_comprobation.title' | translate }}
      </ion-text>
    </div>
    <div class="im__content__message">
      <ion-text class="ux-font-text-xs">
        {{ 'fiat_ramps.wallet_comprobation.message' | translate }}
      </ion-text>
    </div>
    <div class="im__content__buttons">
      <div class="im__content__button__back">
        <ion-button
          class="ux-font-text-xs"
          appTrackClick
          name="close"
          fill="clear"
          color="uxsecondary"
          size="small"
          slot="end"
          (click)="this.close()"
        >
          {{ 'fiat_ramps.wallet_comprobation.btn_back' | translate }}
        </ion-button>
      </div>
      <div class="im__content__button__add">
        <ion-button
          appTrackClick
          name="addApiKey"
          fill="clear"
          color="uxsecondary"
          size="small"
          slot="end"
          (click)="this.addApiKey()"
        >
          {{ 'fiat_ramps.wallet_comprobation.btn_add_apikey' | translate }}
        </ion-button>
      </div>
    </div>
  `,
  styleUrls: ['./informative-modal.component.scss'],
})
export class InformativeModalComponent implements OnInit {
  constructor(private modalController: ModalController, private navController: NavController) {}

  ngOnInit() {}

  close(state: string = 'canceled') {
    this.modalController.dismiss(null, state);
  }

  addApiKey() {
    this.close();
    this.navController.navigateForward(['/apikeys/register']);
  }
}
