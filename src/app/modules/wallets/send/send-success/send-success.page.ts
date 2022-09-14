import { Component } from '@angular/core';
import { TrackService } from 'src/app/shared/services/track/track.service';
import { SUCCESS_TYPES } from '../../../../shared/components/success-content/success-types.constant';

@Component({
  selector: 'app-send-success',
  template: `
    <ion-content class="ion-padding">
      <app-success-content [data]="this.data"></app-success-content>
    </ion-content>
  `,
  styleUrls: ['./send-success.page.scss'],
})
export class SendSuccessPage {
  data = SUCCESS_TYPES.wallet_send;

  constructor(private trackService: TrackService) {}

  ionViewWillEnter() {
    this.trackService.trackEvent({
      eventAction: 'screenview',
      description: window.location.href,
      eventLabel: 'ux_send_screenview_success',
    });
  }
}
