import { Component, Input, OnInit } from '@angular/core';
import { ReferralsCount } from '../../interfaces/referrals-info.interface';

@Component({
  selector: 'app-referrals-pending',
  template: `
    <div class="rp ux-card">
      <div class="rp__title ion-padding">
        <ion-text class="ux-font-text-lg">{{ 'referrals.referrals_pending.title' | translate }}</ion-text>
      </div>
      <div class="rp__summary ion-padding-start ion-padding-end">
        <div class="rp__summary__first-order">
          <app-referral-detail
            [title]="'referrals.referrals_pending.first_order_title' | translate"
            [subtitle]="
              'referrals.referrals_pending.first_order_subtitle'
                | translate: { quantity: this.referrals.first_order.with_wallet }
            "
            [quantity]="this.referrals.first_order.with_wallet"
            [reward]="this.referrals.first_order.reward"
          ></app-referral-detail>
        </div>
        <div class="rp__summary__second-order">
          <app-referral-detail
            [title]="'referrals.referrals_pending.second_order_title' | translate"
            [subtitle]="
              'referrals.referrals_pending.second_order_subtitle'
                | translate: { quantity: this.referrals.second_order.with_wallet }
            "
            [quantity]="this.referrals.second_order.with_wallet"
            [reward]="this.referrals.second_order.reward"
          ></app-referral-detail>
        </div>
      </div>
      <div class="rp__total ion-padding-start ion-padding-end">
        <ion-text class="ux-font-header-titulo">{{ 'referrals.referrals_pending.total_title' | translate }}</ion-text>
        <ion-text class="ux-font-text-lg"
          >$
          {{
            this.referrals.first_order.with_wallet * this.referrals.first_order.reward +
              this.referrals.second_order.with_wallet * this.referrals.second_order.reward
          }}</ion-text
        >
      </div>
      <div class="rp__claim ux-font-button ion-padding-start ion-padding-end">
        <ion-button [disabled]="true" appTrackClick color="uxsecondary" name="Claim" class="ux_button">{{
          'referrals.referrals_pending.claim_button' | translate
        }}</ion-button>
      </div>

      <div class="rp__disclaimer ux-font-text-xxs ion-padding">
        <ion-text>{{ 'referrals.referrals_pending.disclaimer' | translate }}</ion-text>
      </div>
    </div>
  `,
  styleUrls: ['./referrals-pending.component.scss'],
})
export class ReferralsPendingComponent implements OnInit {
  @Input() referrals: ReferralsCount;
  constructor() {}

  ngOnInit() {}
}
