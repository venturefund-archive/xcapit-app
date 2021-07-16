import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-success-claim',
  template: `
    <ion-content class="ion-padding">
      <div class="main">
        <div class="main__close_button">
          <ion-button appTrackClick fill="clear" name="Close Success" (click)="this.close()">
            <ion-icon class="main__close_button__icon" name="ux-close" color="uxmedium"></ion-icon>
          </ion-button>
        </div>
        <div class="main__ux_success_image">
          <img src="../../../../assets/img/referrals/success-claim/success-claim.svg" />
        </div>
        <div class="main__primary_text">
          <ion-text>{{ 'referrals.success_claim_reward.primary_text' | translate }}</ion-text>
        </div>
        <div class="main__secondary_text">
          <ion-text>{{ 'referrals.success_claim_reward.secondary_text' | translate }}</ion-text>
        </div>
        <div class="main__actions">
          <div class="main__actions__primary">
            <ion-button appTrackClick class="ux_button" name="Go To Home" (click)="this.goToHome()">
              {{ 'referrals.success_claim_reward.button_home' | translate }}
            </ion-button>
          </div>
        </div>
      </div>
    </ion-content>
  `,
  styleUrls: ['./success-claim.page.scss'],
})
export class SuccessClaimPage implements OnInit {
  constructor(private navController: NavController) {}

  ngOnInit() {}

  goToHome() {
    this.navController.navigateBack(['/tabs/funds']);
  }

  close() {
    this.navController.navigateBack(['/referrals/list']);
  }
}
