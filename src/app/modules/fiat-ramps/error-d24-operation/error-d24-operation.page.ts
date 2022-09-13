import { Component, OnInit } from '@angular/core';
import { SUCCESS_TYPES } from 'src/app/shared/components/success-content/success-types.constant';
import { TrackService } from 'src/app/shared/services/track/track.service';

@Component({
  selector: 'app-error-d24-operation',
  template: ` <ion-content class="ion-padding">
    <app-success-content [data]="this.data"> </app-success-content>
  </ion-content>`,
  styleUrls: ['./error-d24-operation.page.scss'],
})
export class ErrorD24OperationPage implements OnInit {
  data = SUCCESS_TYPES.error_d24_operation;
  constructor(private trackService: TrackService) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.trackService.trackEvent({
      eventAction: 'screenview',
      description: window.location.href,
      eventLabel: 'ux_buy_d24_screenview_error',
    });
  }
}
