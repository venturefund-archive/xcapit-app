import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-referral-promotion-card',
  template: `
    <div class="rpc" (click)="this.goToReferrals()" name="Go To Referrals">
      <div class="rpc__left">
        <ion-text class="ux-font-text-lg" color="uxprimary">{{
          'referrals.referral_promotion.title' | translate
        }}</ion-text>
        <ion-button
          slot="start"
          appTrackClick
          name="Go To Referrals"
          fill="clear"
          class="text-button-primary align-text-start"
          size="small"
          color="uxprimary"
          (click)="this.goToReferrals()"
        >
          {{ 'referrals.referral_promotion.button' | translate }}
          <ion-icon name="ux-forward"></ion-icon>
        </ion-button>
      </div>
      <div class="rpc__right">
        <img src="assets/img/referrals/referral-promotion-card/referrals-gift.svg" alt="Referral gift" />
      </div>
    </div>
  `,
  styleUrls: ['./referral-promotion-card.component.scss'],
})
export class ReferralPromotionCardComponent implements OnInit {
  constructor(private navController: NavController) {}

  ngOnInit() {}

  goToReferrals(): void {
    this.navController.navigateForward('/referrals/summary');
  }
}
