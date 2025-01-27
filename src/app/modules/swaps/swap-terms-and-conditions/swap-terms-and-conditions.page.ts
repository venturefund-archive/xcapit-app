import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { IonicStorageService } from 'src/app/shared/services/ionic-storage/ionic-storage.service';
import { DefaultSwapsUrls } from '../shared-swaps/routes/default-swaps-urls';

@Component({
  selector: 'app-swap-terms-and-conditions',
  template: `<ion-content class="stc ion-padding">
    <div class="ux_main">
      <div class="stc__close-button">
        <ion-button fill="clear" appTrackClick name="Close Success" (click)="this.close()">
          <ion-icon class="stc__close_button__icon" name="ux-close" color="neutral80"></ion-icon>
        </ion-button>
      </div>
      <div class="stc__img">
        <img src="assets/img/swaps/intermediate-page/swap-terms-and-conditions.svg" />
      </div>
      <div class="stc__title">
        <ion-text class="ux-font-text-xl">{{ 'swaps.terms_and_conditions.title' | translate }} </ion-text>
      </div>
      <div class="stc__items">
        <div class="stc__items__item">
          <img src="assets/ux-icons/ux-circle-users-info.svg" />
          <ion-text class="ux-font-text-base" color="neutral90">
            {{ 'swaps.terms_and_conditions.condition_1' | translate }}
          </ion-text>
        </div>
        <div class="stc__items__item">
          <img src="assets/ux-icons/ux-circle-swap.svg" />
          <ion-text class="ux-font-text-base" color="neutral90"
            >{{ 'swaps.terms_and_conditions.condition_2' | translate }}
          </ion-text>
        </div>
        <div class="stc__items__item">
          <img src="assets/ux-icons/ux-circle-y-info.svg" />
          <ion-text class="ux-font-text-base" color="neutral90"
            >{{ 'swaps.terms_and_conditions.condition_3' | translate }}
          </ion-text>
        </div>
      </div>
      <div class="stc__items">
        <div class="stc__checkbox">
          <app-one-inch-tos-check (toggledCheckbox)="this.onToggleCheckbox($event)" [showCheck]="true">
          </app-one-inch-tos-check>
        </div>
        <div class="stc__button">
          <ion-button
            [disabled]="!this.acceptTos"
            class="ux_button"
            name="ux_swap_terms_and_conditions"
            type="button"
            color="secondary"
            expand="block"
            size="large"
            appTrackClick
            (click)="this.goToSelectProvider()"
          >
            {{ 'swaps.terms_and_conditions.button' | translate }}
          </ion-button>
        </div>
      </div>
    </div>
  </ion-content>`,
  styleUrls: ['./swap-terms-and-conditions.page.scss'],
})
export class SwapTermsAndConditionsPage {
  acceptTos = false;
  key = 'termsAndConditions1InchSwapAccepted';
  constructor(private navController: NavController,
    private storage: IonicStorageService) {}

  onToggleCheckbox(acceptTos: boolean) {
    this.acceptTos = acceptTos;
  }

  async goToSelectProvider() {
    await this.storage.set(this.key, this.acceptTos);
    this.navController.navigateForward(new DefaultSwapsUrls().home(), { replaceUrl: true });
  }

  close() {
    this.navController.back();
  }
}
