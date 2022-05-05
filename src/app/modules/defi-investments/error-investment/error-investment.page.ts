import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SUCCESS_TYPES } from '../../../shared/components/success-content/success-types.constant';
import { TrackService } from '../../../shared/services/track/track.service';

@Component({
  selector: 'app-error-investment',
  template: `
    <ion-content class="ion-padding">
      <app-success-content
        *ngIf="this.data"
        [data]="this.data"
        imageAlt="Success Image"
      ></app-success-content>
    </ion-content>
  `,
  styleUrls: ['./error-investment.page.scss'],
})
export class ErrorInvestmentPage {
  data: any;
  vault: string;
  constructor(private route: ActivatedRoute, private trackService: TrackService) {}

  ionViewWillEnter() {
    this.data = SUCCESS_TYPES.error_investment;
    this.vault = this.getVault();
    this.setBackUrl();
    this.trackService.trackEvent({
      eventAction: 'screenview',
      description: window.location.href,
      eventLabel: 'ux_invest_screenview_error'
    });
  }

  setBackUrl() {
    if (this.vault) {
      this.data.urlPrimaryAction = `defi/new/insert-amount/${this.vault}/add`;
    }
  }

  getVault() {
    return this.route.snapshot.paramMap.get('vault');
  }
}
