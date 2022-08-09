import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-coin-selector-modal',
  template: `<div class="main__body">
  <div class="main__body__content">
    <div class="main__body__content__title">
      <ion-label class= "ux-font-text-lg"
        >{{ 'fiat_ramps.shared.coin_selector_modal.title' | translate }}
      </ion-label>
    </div>
    <div class="main__body__content__description">
      <ion-label color="neutral90" class="ux-font-text-base ion-no-margin">
        {{ 'fiat_ramps.shared.coin_selector_modal.description' | translate }}
      </ion-label>
    </div>
  </div>
  <div class="main__actions">
    <ion-button
      class="ux-link-xl main__actions__button"
      fill="clear"
      type="submit"
      (click)="this.handleSubmit()"
    >
      {{ 'fiat_ramps.shared.coin_selector_modal.button' | translate }}
    </ion-button>
  </div>
</div> 
  
  `,
  styleUrls: ['./coin-selector-modal.component.scss'],
})
export class CoinSelectorModalComponent implements OnInit {

  constructor(
    private modalControler: ModalController,
    private navController: NavController
  ) { }

  ngOnInit() {}

  handleSubmit() {
    this.modalControler.dismiss();
    this.navController.navigateRoot(['/fiat-ramps/token-selection']);
  }

}
