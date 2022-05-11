import { Component } from '@angular/core';
import { SUCCESS_TYPES } from '../../../shared/components/success-content/success-types.constant';
import { ActivatedRoute } from '@angular/router';
import { TrackService } from '../../../shared/services/track/track.service';

@Component({
  selector: 'app-success-investment',
  template: `
    <ion-content class="ion-padding">
      <app-success-content
        *ngIf="this.data"
        [data]="this.data"
        imageAlt="Success Image"
      ></app-success-content>
    </ion-content>
  `,
  styleUrls: ['./success-investment.page.scss'],
})
export class SuccessInvestmentPage {
  data: any;
  constructor(private route: ActivatedRoute, private trackService: TrackService) {}

  ionViewWillEnter() {
    this.data = this.newInvestment() ? SUCCESS_TYPES.success_investment : SUCCESS_TYPES.success_add_amount;
    this.trackService.trackEvent({
      eventAction: 'screenview',
      description: window.location.href,
      eventLabel: 'ux_invest_screenview_success'
    });
  }

  newInvestment() {
    return this.route.snapshot.paramMap.get('type') === 'invest';
  }
}
