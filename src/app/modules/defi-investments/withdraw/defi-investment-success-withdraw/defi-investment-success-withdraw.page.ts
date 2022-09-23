import { Component } from '@angular/core';
import { TrackService } from 'src/app/shared/services/track/track.service';
import { SUCCESS_TYPES } from '../../../../shared/components/success-content/success-types.constant';

@Component({
  selector: 'app-defi-investment-success-withdraw',
  template: ` <ion-content class="ion-padding">
    <app-success-content *ngIf="this.data" [data]="this.data"></app-success-content>
  </ion-content>`,
  styleUrls: ['./defi-investment-success-withdraw.page.scss'],
})
export class DefiInvestmentSuccessWithdrawPage {
  data: any;
  constructor(private trackService: TrackService) {}

  ionViewWillEnter() {
    this.data = SUCCESS_TYPES.success_defi_withdraw;
    this.trackService.trackEvent({
      eventAction: 'screenview',
      description: window.location.href,
      eventLabel: 'ux_invest_withdraw_screenview_success',
    });
  }
}
