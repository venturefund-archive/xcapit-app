import { Component, OnInit } from '@angular/core';
import { ApiReferralsService } from '../shared-referrals/services/api-referrals/api-referrals.service';
import { ReferralsCount } from '../shared-referrals/interfaces/referrals-info.interface';
import { environment } from '../../../../environments/environment';
import { ApiUsuariosService } from '../../usuarios/shared-usuarios/services/api-usuarios/api-usuarios.service';

@Component({
  selector: 'app-referrals-summary',
  template: `
    <ion-header>
      <ion-toolbar color="uxprimary" class="ux_toolbar">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/tabs/home"></ion-back-button>
        </ion-buttons>
        <ion-title class="ion-text-center">{{ 'referrals.referrals_summary.header' | translate }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="rs ion-padding">
      <div class="rs__referrals-share" *ngIf="this.referrals && this.referralLink">
        <app-referrals-share
          [firstOrderReward]="this.referrals.first_order.reward"
          [secondOrderReward]="this.referrals.second_order.reward"
          [link]="this.referralLink"
        ></app-referrals-share>
      </div>
      <div class="rs__referrals-pending" *ngIf="this.referrals">
        <app-referrals-pending [referrals]="this.referrals"></app-referrals-pending>
      </div>
      <div class="rs__referrals-history" *ngIf="this.referrals">
        <app-referrals-history [referrals]="this.referrals"></app-referrals-history>
      </div>
    </ion-content>
  `,
  styleUrls: ['./referrals-summary.page.scss'],
})
export class ReferralsSummaryPage implements OnInit {
  constructor(private apiReferralsService: ApiReferralsService, private apiUsuariosService: ApiUsuariosService) {}

  referrals: ReferralsCount;
  referralLink: string;

  ngOnInit() {}

  ionViewWillEnter() {
    this.getReferralLink();
    this.getReferralInfo();
  }

  getReferralInfo() {
    this.apiReferralsService.getUserReferralsInfo().subscribe((res: ReferralsCount) => (this.referrals = res));
  }

  getReferralLink() {
    this.apiUsuariosService.getUser(true).subscribe((user: any) => {
      this.referralLink = `${environment.appUrl}users/register/${user.referral_id}`;
    });
  }
}
