import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { TrackService } from 'src/app/shared/services/track/track.service';

@Component({
  selector: 'app-user-steps-naranjax',
  template: `<div class="bg">
      <div class="bg__close_button">
        <ion-button
          name="Close button"
          class="bg__close ion-no-padding"
          slot="icon-only"
          fill="clear"
          color="white"
          (click)="this.close()"
        >
          <ion-icon class="bg__close_button__icon" name="ux-close"></ion-icon>
        </ion-button>
      </div>
    </div>
    <ion-content class="usn ion-padding">
      <div class="class usn__content">
        <div class="usn__content__title">
          <ion-text class="ux-font-text-xl">
            {{ 'wallets.user_steps_naranjax.title' | translate }}
          </ion-text>
        </div>

        <div class="usn__content__items">
          <ul>
            <ion-text class="ux-font-text-base">
              <li>{{ 'wallets.user_steps_naranjax.item_1' | translate }}</li>
            </ion-text>
            <ion-text class="ux-font-text-base">
              <li>{{ 'wallets.user_steps_naranjax.item_2' | translate }}</li>
            </ion-text>
            <ion-text class="ux-font-text-base">
              <li>{{ 'wallets.user_steps_naranjax.item_3' | translate }}</li>
            </ion-text>
            <ion-text class="ux-font-text-base">
              <li>{{ 'wallets.user_steps_naranjax.item_4' | translate }}</li>
            </ion-text>
          </ul>
        </div>
      </div>
    </ion-content>
    <ion-footer>
      <ion-toolbar class="ux_toolbar">
        <div name="Create Password Form Buttons" class="ux_footer">
          <div class="button">
            <ion-button
              class="ux_button ion-no-margin"
              display="block"
              appTrackClick
              name="ux_continue"
              color="secondary"
              size="large"
              (click)="this.handleSubmit()"
            >
              {{ 'wallets.user_steps_naranjax.button' | translate }}
            </ion-button>
          </div>
        </div>
      </ion-toolbar>
    </ion-footer>`,
  styleUrls: ['./user-steps-naranjax.page.scss'],
})
export class UserStepsNaranjaxPage {
  constructor(private navController: NavController, private trackService: TrackService) {}

  ionViewWillEnter() {
    this.trackService.trackEvent({
      eventAction: 'screenview',
      description: window.location.href,
      eventLabel: 'ux_screenview_onboarding_naranjaxsteps',
    });
  }

  close(): void {
    this.navController.navigateBack('/wallets/select-wallet-type');
  }

  handleSubmit() {
    this.navController.navigateForward('/wallets/create-password/create');
  }
}
