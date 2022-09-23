import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { RemoteConfigService } from 'src/app/shared/services/remote-config/remote-config.service';

@Component({
  selector: 'app-referral-promotion-card',
  template: `
    <div *appFeatureFlag="'ff_referralsCard'" class="rpc" (click)="this.goToReferrals()" name="Go To Referrals">
      <div class="rpc__left">
        <ion-text class="ux-font-text-lg" color="primary">{{
          'referrals.referral_promotion.title' | translate
        }}</ion-text>
        <ion-button
          slot="start"
          appTrackClick
          name="Go To Referrals"
          fill="clear"
          class="text-button-primary align-text-start"
          size="small"
          color="primary"
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
  constructor(private navController: NavController, private remoteConfigService : RemoteConfigService) {}

  ngOnInit() {}

  goToReferrals(): void {
    const url  = this.remoteConfigService.getString('referralsMenuUrl_referralPromotionCard');
    this.navController.navigateForward(url);
  }
}
