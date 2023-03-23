import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { IonicStorageService } from 'src/app/shared/services/ionic-storage/ionic-storage.service';
import { TokenOperationDataService } from '../shared-ramps/services/token-operation-data/token-operation-data.service';

@Component({
  selector: 'app-buy-conditions',
  template: `
    <ion-content class="bc ion-padding">
      <div class="ux_main">
        <div class="bc__close-button">
          <ion-button fill="clear" appTrackClick name="Close Success" (click)="this.close()">
            <ion-icon class="bc__close_button__icon" name="ux-close" color="neutral80"></ion-icon>
          </ion-button>
        </div>
        <div class="bc__img">
          <img src="assets/img/fiat-ramps/intermediate-page/buy.svg" />
        </div>
        <div class="bc__title">
          <ion-text class="ux-font-text-xl">{{ 'fiat_ramps.buy_conditions.title' | translate }} </ion-text>
        </div>
        <div class="bc__items">
          <div class="bc__items__item">
            <img src="assets/ux-icons/ux-circle-money.svg" />
            <ion-text class="ux-font-text-base" color="neutral90">
              {{ 'fiat_ramps.buy_conditions.condition_1' | translate }}
            </ion-text>
          </div>
          <div class="bc__items__item">
            <img src="assets/ux-icons/ux-shopping-cart.svg" />
            <ion-text class="ux-font-text-base" color="neutral90"
              >{{ 'fiat_ramps.buy_conditions.condition_2' | translate }}
            </ion-text>
          </div>
          <div class="bc__items__item">
            <img src="assets/ux-icons/ux-circle-users.svg" />
            <ion-text class="ux-font-text-base" color="neutral90"
              >{{ 'fiat_ramps.buy_conditions.condition_3' | translate }}
            </ion-text>
          </div>
        </div>
        <div class="bc__ux_footer">
          <div class="bc__checkbox">
            <ion-checkbox mode="md" slot="start" name="checkbox-condition" (ionChange)="this.updateState($event)">
            </ion-checkbox>
            <ion-label class="ux-font-text-xs"> {{ 'fiat_ramps.buy_conditions.label_check' | translate }}</ion-label>
          </div>
          <div class="bc__button">
            <ion-button
              [disabled]="!this.acceptTos"
              class="ux_button"
              name="buy_conditions"
              type="button"
              color="secondary"
              expand="block"
              size="large"
              appTrackClick
              (click)="this.goToPurhasesHome()"
            >
              {{ 'fiat_ramps.buy_conditions.button' | translate }}
            </ion-button>
          </div>
        </div>
      </div>
    </ion-content>
  `,
  styleUrls: ['./buy-conditions.page.scss'],
})
export class BuyConditionsPage implements OnInit {
  acceptTos = false;
  key = 'conditionsPurchasesAccepted';
  constructor(
    private navController: NavController,
    private storage: IonicStorageService,
  ) {}

  ngOnInit() {}

  updateState(state: any) {
    this.acceptTos = state.detail.checked;
    this.storage.set(this.key, state.detail.checked);
  }

  goToPurhasesHome() {
    this.navController.navigateForward(['fiat-ramps/purchases']);
  }

  close() {
    this.navController.navigateBack('tabs/wallets');
  }
}
