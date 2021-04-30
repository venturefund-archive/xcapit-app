import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-points-card',
  template: ` <div class="ric">
    <div class="ric__content">
      <div class="ric__content__left">
        <div class="points">
          <ion-text
            class="ux-font-lato ux-fweight-bold ux-fsize-14"
            color="uxsemidark"
            >0
            {{
              'referrals.new_referral_page.points_card.points_text' | translate
            }}</ion-text
          >
        </div>
      </div>
      <div class="ric__content__right">
        <ion-badge class="ux_badge_coming" slot="end">{{
          'referrals.new_referral_page.points_card.coming_badge' | translate
        }}</ion-badge>
      </div>
    </div>
  </div>`,
  styleUrls: ['./points-card.component.scss'],
})
export class PointsCardComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
