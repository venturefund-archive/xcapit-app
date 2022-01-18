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
            [quantity]=" 'referrals.referrals_pending.points' | translate: { quantity: this.referrals.first_order.with_wallet}"
            [reward]="this.referrals.first_order.reward"
          ></app-referral-detail>
        </div>
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
