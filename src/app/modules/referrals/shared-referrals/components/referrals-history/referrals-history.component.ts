import { Component, Input, OnInit } from '@angular/core';
import { ReferralsCount } from '../../interfaces/referrals-info.interface';

@Component({
  selector: 'app-referrals-history',
  template: `
    <div class="rh ux-card">
      <div class="rh__title ion-padding">
        <ion-text class="ux-font-text-lg">{{ 'referrals.referrals_history.title' | translate }}</ion-text>
      </div>
      <div class="rh__summary ion-padding-start ion-padding-end">
        <div class="rh__summary__first-order">
          <app-referral-detail
            [title]="'referrals.referrals_history.first_order_title' | translate"
            [subtitle]="
              'referrals.referrals_history.first_order_subtitle'
                | translate: { quantity: this.referrals.first_order.without_wallet }
            "
            [quantity]="this.referrals.first_order.without_wallet"
          ></app-referral-detail>
        </div>
        <div class="rh__summary__second-order">
          <app-referral-detail
            [title]="'referrals.referrals_history.second_order_title' | translate"
            [subtitle]="
              'referrals.referrals_history.second_order_subtitle'
                | translate: { quantity: this.referrals.second_order.without_wallet }
            "
            [quantity]="this.referrals.second_order.without_wallet"
          ></app-referral-detail>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./referrals-history.component.scss'],
})
export class ReferralsHistoryComponent implements OnInit {
  @Input() referrals: ReferralsCount;
  constructor() {}

  ngOnInit() {}
}
