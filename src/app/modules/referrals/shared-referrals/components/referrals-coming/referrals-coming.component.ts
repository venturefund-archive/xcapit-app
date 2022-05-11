import { Component, OnInit } from '@angular/core';
import { BrowserService } from 'src/app/shared/services/browser/browser.service';

@Component({
  selector: 'app-referrals-coming',
  template:`
    <div class="rc ux-card ion-padding">
      <div class="rc__img">
        <img src="assets/img/referrals/referrals-coming/referrals-magic.svg" alt="Referral Coming" />
      </div>

      <div class="rc__title">
        <ion-text class="ux-font-text-xl">{{ 'referrals.referrals_coming.title' | translate }}</ion-text>
      </div>

      <div class="rc__paragraph">
        <ion-text class="ux-font-text-base">
          {{ 'referrals.referrals_coming.paragraph' | translate }}
        </ion-text>
      </div>

      <div class="rc__tos">
        <a class="ux-link-xs" (click)="this.goToToS()">{{ 'referrals.referrals_coming.tos' | translate }}</a>
      </div>
    </div>
  `,
  styleUrls: ['./referrals-coming.component.scss'],
})
export class ReferralsComingComponent implements OnInit {

  constructor(
    private browserService: BrowserService
  ) { }

  ngOnInit() {}

  async goToToS() {
    await this.browserService.open({
      url: 'https://xcapit.com/financial-freedom-tyc/',
    });
  }

}
