import { Component, OnInit } from '@angular/core';
import { SUCCESS_TYPES } from 'src/app/shared/components/success-content/success-types.constant';
import { TrackService } from 'src/app/shared/services/track/track.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-success-page',
  template: `
    <ion-content class="ion-padding">
      <app-success-content [data]="this.data"> </app-success-content>
    </ion-content>
  `,
  styleUrls: ['./success-page.page.scss'],
})
export class SuccessPagePage implements OnInit {
  data: any;

  constructor(private trackService: TrackService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.data = { ...SUCCESS_TYPES.success_fiat_ramps };
  }

  ionViewWillEnter() {
    this.setButtonURL();
    this.trackScreenViewEvent();
  }

  setButtonURL() {
    const operationId = this.route.snapshot.paramMap.get('operationId');
    this.data.urlPrimaryAction = `${this.data.urlPrimaryAction}${operationId}`;
  }

  trackScreenViewEvent() {
    this.trackService.trackEvent({
      eventAction: 'screenview',
      description: window.location.href,
      eventLabel: 'ux_krypton_screenview_request_created',
    });
  }
}
