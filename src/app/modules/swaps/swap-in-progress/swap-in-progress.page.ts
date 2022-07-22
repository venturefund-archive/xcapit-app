import { Component } from '@angular/core';
import { SUCCESS_TYPES } from 'src/app/shared/components/success-content/success-types.constant';
import { TrackService } from 'src/app/shared/services/track/track.service';

@Component({
  selector: 'app-swap-in-progress',
  template: ` <ion-content class="ion-padding">
    <app-success-content [data]="this.data"></app-success-content>
  </ion-content>`,
  styleUrls: ['./swap-in-progress.page.scss'],
})
export class SwapInProgressPage {
  data = SUCCESS_TYPES.swap_in_progress;
  constructor(private trackService: TrackService) {}

  ionViewDidEnter() {
    this.trackPage();
  }

  private trackPage() {
    this.trackService.trackEvent({
      eventAction: 'screenview',
      description: window.location.href,
      eventLabel: 'ux_swaps_screenview_swap_in_progress',
    });
  }
}
