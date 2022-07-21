import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { LINKS } from 'src/app/config/static-links';
import { BrowserService } from 'src/app/shared/services/browser/browser.service';
import { IonicStorageService } from 'src/app/shared/services/ionic-storage/ionic-storage.service';
import { defaultSwapsUrls } from '../swaps-routing.module';

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
        <div class="stc__checkbox">
          <ion-checkbox mode="md" slot="start" name="checkbox-condition" (ionChange)="this.enableButton()">
          </ion-checkbox>
          <ion-label class="stc__checkbox__phrase checkbox-link">
            <ion-label class="ux-font-text-xs">
              {{ 'swaps.terms_and_conditions.terms.i_have_read' | translate }}</ion-label>
            <ion-label class="ux-link-xs" name="go_to_1inch_tos" appTrackClick (click)="this.openTOS()">
              {{ 'swaps.terms_and_conditions.terms.link_to_terms' | translate }}</ion-label>
            <ion-label class="ux-font-text-xs">&nbsp; {{ 'swaps.terms_and_conditions.terms.of' | translate }}</ion-label>
          </ion-label>
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

      <div class="stc__ux_footer"></div>
    </div>
  </ion-content>`,
  styleUrls: ['./swap-terms-and-conditions.page.scss'],
})
export class SwapTermsAndConditionsPage implements OnInit {
  acceptTos = false;
  key = 'termsAndConditions1InchSwapAccepted';
  links = LINKS;
  constructor(private navController: NavController,
    private storage: IonicStorageService,
    private browserService: BrowserService,) {}

  ngOnInit() {}

  enableButton() {
    return (this.acceptTos = !this.acceptTos);
  }

  goToSelectProvider() {
    this.storage.set(this.key, true);
    this.navController.navigateForward(defaultSwapsUrls.swapHome);
  }

  close() {
    this.navController.back();
  }

  openTOS(): void {
    this.browserService.open({ url: this.links.oneInchToS });
  }
}
