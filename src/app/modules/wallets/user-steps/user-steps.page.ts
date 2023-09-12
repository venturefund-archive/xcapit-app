import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ActiveLenderInjectable } from 'src/app/shared/models/active-lender/injectable/active-lender.injectable';
import { RawLender } from 'src/app/shared/models/lender/raw-lender.type';
import { TrackService } from 'src/app/shared/services/track/track.service';

@Component({
  selector: 'app-user-steps',
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
    <ion-content class="us ion-padding">
      <div class="class us__content" *ngIf="this.tplLender">
        <div class="us__content__title">
          <ion-text class="ux-font-text-xl">
            {{ this.tplLender.stepsTitle }}
          </ion-text>
        </div>

        <div class="us__content__items">
          <ul>
            <ion-text class="ux-font-text-base" *ngFor="let step of this.tplLender.steps">
              <li>{{ step }}</li>
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
              {{ 'wallets.user_steps.button' | translate }}
            </ion-button>
          </div>
        </div>
      </ion-toolbar>
    </ion-footer>`,
  styleUrls: ['./user-steps.page.scss'],
})
export class UserStepsPage {
  tplLender: RawLender;
  constructor(
    private navController: NavController,
    private trackService: TrackService,
    private activeLenderInjectable: ActiveLenderInjectable
  ) {}

  async ionViewWillEnter() {
    this.tplLender = (await this.activeLenderInjectable.create().value()).json();
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
